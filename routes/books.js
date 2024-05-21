const express = require('express')
const { v4: uuid } = require('uuid')
const router = express.Router()
const fileMulter = require('../middleware/file')
class Book {
  constructor (
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    fileBook = '',
    id = uuid()
  ) {
    this.title = title
    this.description = description
    this.authors = authors
    this.favorite = favorite
    this.fileCover = fileCover
    this.fileName = fileName
    this.fileBook = fileBook
    this.id = id
  }
};

const stor = {
  book: [
    new Book(),
    new Book()
  ]
}

// получить все книги
router.get('/', (req, res) => {
  const { book } = stor
  res.render('todo/index', {
    title: 'Просмотр списка книг',
    todos: book
  })
  // res.json(book)
})

// получить книгу по ID
router.get('/:id', (req, res) => {
  const { book } = stor
  const { id } = req.params
  const idx = book.findIndex(el => el.id === id)
  if (idx !== -1) {
    // res.json(book[idx])
    res.render('todo/view', {
      title: `Информация по книге ${book[idx].title}`,
      todo: book[idx]
    })
  } else {
    res.status(404)
    res.redirect('/404')
    res.json('Code: 404')
  }
})

router.get('/create', (req, res) => {
  console.log(req)
  res.render('todo/create', {
    title: 'Добавить книгу',
    todo: {}
  })
})
// создать книгу
router.post('/create',
  fileMulter.single('fileBook'),
  (req, res) => {
    const { book } = stor
    const {
      title,
      description,
    } = req.body

    const newBook = new Book(title, description)

    book.push(newBook)

    // res.json(newBook)
    res.redirect('/api/books')
  })

router.get('/update/:id', (req, res) => {
  const { book } = stor
  const { id } = req.params

  const idx = book.findIndex(el => el.id === id)

  if (idx === -1) {
    res.redirect('/404')
  }

  // res.json(book[idx])
  res.render('todo/update', {
    title: 'Редактирование',
    todo: book[idx]
  })
})
router.post('/update/:id',
  fileMulter.single('fileBook'),
  (req, res) => {
    const { book } = stor
    const {
      title,
      description
    } = req.body

    console.log(req.body)

    const { id } = req.params
    const idx = book.findIndex(el => el.id === id)

    if (idx !== -1) {
      book[idx] = {
        ...book[idx],
        title,
        description
      }
      res.redirect('/api/books')

      // res.json(book[idx])
    } else {
      res.status(404)
      res.redirect('/404')
      // res.json('Code: 404')
    }
  })
// удалить книгу по ID
router.delete('/:id', (req, res) => {
  const { book } = stor
  const { id } = req.params
  const idx = book.findIndex(el => el.id === id)

  if (idx !== -1) {
    book.splice(idx, 1)
    res.json('ok')
  } else {
    res.status(404)
    res.json('Code: 404')
  }
})

// скачиваение файла по id
router.get('/:id/download', (req, res) => {
  const { book } = stor
  const { id } = req.params
  const idx = book.findIndex(el => el.id === id)

  if (idx !== -1) {
    const bookToDownload = book[idx]
    const file = bookToDownload.fileBook
    if (file) {
      res.download(file)
    } else {
      res.status(404)
      res.json('File not found')
    }
  } else {
    res.status(404)
    res.json('Code: 404')
  }
})

module.exports = router
