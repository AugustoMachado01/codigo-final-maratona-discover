const links = document.querySelectorAll('a.toggle')

// Toggle
const clickToggle = () => {
  const div = document.querySelector('.modal-overlay')
  div.classList.toggle('active')
}

for (const link of links) {
  link.addEventListener('click', clickToggle)
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify('transactions')
    )
  }
}

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction)

    app.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    app.reload()
  },

  incomes() {
    let income = 0
    Transaction.all.forEach(element => {
      if (element.amount > 0) {
        income = income + element.amount
      }
    })
    return income
  },
  expanses() {
    let expanse = 0
    Transaction.all.forEach(element => {
      if (element.amount < 0) {
        expanse = expanse + element.amount
      }
    })
    return expanse
  },
  total() {
    return Transaction.incomes() + Transaction.expanses()
  }
}
const Utils = {
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },
  formatDate(date) {
    let splittedDate = date.split('-')

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return signal + value
  }
}

const form = document.querySelector('form')
const description = document.querySelector('input#description')
const amount = document.querySelector('input#amount')
const date = document.querySelector('input#date')

const getValues = () => {
  return {
    description: description.value,
    amount: amount.value,
    date: date.value
  }
}

validataFilds = ({ description, amount, date }) => {
  if (!description.trim() || !amount || !date) {
    throw new Error('por favor,preencha os campos todos')
  } else {
    alert('ok')
  }
}

formatValues = () => {
  let { description, amount, date } = getValues()

  amount = Utils.formatAmount(amount)
  date = Utils.formatDate(date)

  return {
    descriptins: description,
    amount,
    date
  }
}

clearFields = () => {
  description.value = ''
  amount.value = ''
  date.value = ''
}

form.addEventListener('submit', event => {
  event.preventDefault()

  try {
    validataFilds(getValues())
    const transaction = formatValues()
    Transaction.add(transaction)
    clearFields()
    clickToggle()
  } catch (error) {
    alert(error.message)
  }
})

//substituir os dados do html com os dados do js
const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransactions(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = amount > 0 ? 'income' : 'expense'

    const amoun = Utils.formatCurrency(transaction.amount)

    const html = ` 
    <td class="description">${transaction.descriptins}</td>
    <td class="${CSSclass}">${amoun}</td>
    <td class="date">${transaction.date}</td>
    <td class="">
    <img onclick = "Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transaction" />
    </td>
  `

    return html
  },
  upDateBalence() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expanses()
    )
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    )
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

const app = {
  init() {
    Transaction.all.forEach(DOM.addTransactions)

    DOM.upDateBalence()

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    app.init()
  }
}

app.init()
