const form = document.forms.form;
const transactionContainer = document.querySelector('.transactions');
const balance = document.querySelector('.balance');
const transferBtn = document.querySelector('#transfer-btn');
const creditBtn = document.querySelector('#credit-btn');
const closeBtn = document.querySelector('#close-btn');
let currentAccount;
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value;
    const password = +form.elements.pass.value;
    currentAccount = accounts.find(item => item.userName === name);
    if (currentAccount) {
        if (currentAccount.pin === password) {
            document.querySelector('.registr').style.display = 'none';
            document.querySelector('.bank').style.display = 'block';

            document.querySelector('.head').innerHTML = `Добро пожаловать, ${currentAccount.userName}`;
            document.querySelector('.info__date').innerHTML = `на ${new Date().toLocaleString()}`;
            displayTransaction();
            displayTotal();
            form.reset();
        } else {
            alert('Неверный пароль!');
            form.elements.pass.value = '';
        }
    }
});

function displayTransaction() {
    transactionContainer.innerHTML = '';
    currentAccount.transactions.forEach((item, ind) => {
        const date = new Date(currentAccount.transactionsDate[ind]).toLocaleDateString();
        const type = item > 0 ? 'deposit' : 'withdrawal';
        transactionContainer.innerHTML += `
        <div class="transactions__row">
        <div class="transactions__date">${date}</div>
        <div class="transactions__type transactions__type--${type}">${type}</div>
        <div class="transactions__value">${item}</div>
        </div>
        `;
    });
}

function displayTotal() {
    const total = currentAccount.transactions.reduce((a, b) => a + b);
    currentAccount.total = total;
    balance.innerHTML = `${total}$`;
    const deposit = currentAccount.transactions.filter(i => i > 0).reduce((a, b) => a + b);
    let withdrawal = currentAccount.transactions.filter(i => i < 0);
    if (withdrawal.length > 0) {
        withdrawal = withdrawal.reduce((a, b) => a + b);
    }
    document.querySelector('.total__value--in').innerHTML = `Получение: <span>${deposit}$</span>`;
    document.querySelector('.total__value--out').innerHTML = `Вывод: <span>${Array.isArray(withdrawal) ? '0$' : `${withdrawal}$`}</span>`;
}

function makeTransactions(e) {
    e.preventDefault();
    const recipient = document.querySelector('#recipient').value;
    const sum = document.querySelector('#sum').value;
    if (accounts.find(item => item.userName === recipient) && recipient !== currentAccount.userName && sum < currentAccount.total) {
        currentAccount.transactions.push(-sum);
        currentAccount.transactionsDate.push(new Date().toISOString());
        displayTransaction();
        displayTotal();
        document.forms.transfer.reset();
    } else {
        alert('Пользователь не найден');
    }
}

transferBtn.addEventListener('click', makeTransactions);

function takeDeposit(e) {
    e.preventDefault();
    const sum = +document.querySelector('#credit-sum').value;
    if (currentAccount.transactions.some(i => i >= sum * 0.1)) {
        currentAccount.transactions.push(sum);
        currentAccount.transactionsDate.push(new Date().toISOString());
        displayTransaction();
        displayTotal();
        document.forms.credit.reset();
    } else {
        alert('Займ отклонен');
    }
}

creditBtn.addEventListener('click', takeDeposit);


function closeAccount(e) {
    e.preventDefault();
    const name = document.querySelector('#close-name').value;
    const pin = +document.querySelector('#close-pin').value;
    if (currentAccount.userName === name && currentAccount.pin === pin) {
        const ind = accounts.findIndex(i => i.userName === name);
        accounts.splice(ind, 1);
        document.querySelector('.registr').style.display = 'flex';
        document.querySelector('.bank').style.display = 'none';
    } else {
        alert('Ошибка вводимых данных');
        document.forms.close.reset();
    }
}

closeBtn.addEventListener('click', closeAccount);