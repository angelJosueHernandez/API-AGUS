const { Router } = require('express');
const { loginUser, getUserTasks } = require('../controllers/user.controllers');

const router = Router();

router.post('/loginuser', loginUser);
router.get('/tasks/:ID_Usuario', getUserTasks);

module.exports = router;
