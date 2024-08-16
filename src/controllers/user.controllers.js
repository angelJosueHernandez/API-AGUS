const { getConnection, sql } = require('../database/connection');

// Función para el login del usuario



exports.loginUser = async (req, res) => {
    const { email, contrasena } = req.body;

    console.log(`Email: ${email}, Contraseña: ${contrasena}`); // Depuración

    if (!email || !contrasena) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT ID_Usuario, nombre, contrasena FROM usuario WHERE correo = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.recordset[0];
        
        if (contrasena !== user.contrasena) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Devuelve ID_Usuario y nombre para mostrar en la bienvenida
        res.json({ message: 'Inicio de sesión exitoso', ID_Usuario: user.ID_Usuario, nombre: user.nombre });
    } catch (err) {
        console.error('Error en loginUser:', err);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};


// Función para obtener las tareas del usuario
exports.getUserTasks = async (req, res) => {
    const { ID_Usuario } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('ID_Usuario', sql.Int, ID_Usuario)
            .query('SELECT * FROM tareas WHERE ID_Usuario = @ID_Usuario');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para este usuario' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en getUserTasks:', err);
        res.status(500).json({ message: 'Error al obtener las tareas del usuario' });
    }
};
