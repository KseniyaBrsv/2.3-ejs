module.exports = (req, res) => {
  res.status(404)
  res.render('errors/404', {
    title: '404'
  })
  //res.json('404 | страница не найдена')
}
