var router = require('express').Router();

router.get('/', async (req, res) => {
  res.render('admin/index', { title: '/' });
});
router.get('/content', async (req, res) => {
  res.render('admin/content', { title: '/' });
});
router.get('/users', async (req, res) => {
  res.render('admin/users', { title: '/' });
});
router.get('/groups', async (req, res) => {
  res.render('admin/groups', { title: '/' });
});
module.exports = router;
