const { getConnection, sql } = require('../database/connection');
const moment = require('moment-timezone');


// Función para el login del usuario
exports.loginUser = async (req, res) => {
    const { correo, contrasena } = req.body;

    console.log(`Email: ${correo}, Contraseña: ${contrasena}`); // Depuración

    if (!correo || !contrasena) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('correo', sql.VarChar, correo)
            .query('SELECT ID_Usuario, nombre, contrasena FROM usuario WHERE correo = @correo');

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
            console.log(`No se encontraron tareas para el usuario con ID: ${ID_Usuario}`);
            return res.status(404).json({ message: 'No se encontraron tareas para este usuario' });
        }

        // Formateo de fechas y horas
        const formattedTasks = result.recordset.map(task => {
            const fechaCreacionOriginal = new Date(task.fecha_creacion);
            const fechaCreacionMexico = new Date(fechaCreacionOriginal.getTime() + fechaCreacionOriginal.getTimezoneOffset() * 60000);
            const fechaCreacionFormateada = fechaCreacionMexico.toISOString().split('T')[0];

            const fechaVencimientoOriginal = new Date(task.fecha_vencimiento);
            const fechaVencimientoMexico = new Date(fechaVencimientoOriginal.getTime() + fechaVencimientoOriginal.getTimezoneOffset() * 60000);
            const fechaVencimientoFormateada = fechaVencimientoMexico.toISOString().split('T')[0];

            const fechaCreacionMoment = moment.tz(fechaCreacionFormateada, 'America/Mexico_City');
            const fechaVencimientoMoment = moment.tz(fechaVencimientoFormateada, 'America/Mexico_City');

            return {
                ...task,
                fecha_creacion: fechaCreacionMoment.format('DD/MM/YYYY'),
                fecha_vencimiento: fechaVencimientoMoment.format('DD/MM/YYYY')
            };
        });

        res.json(formattedTasks);
    } catch (err) {
        console.error('Error en getUserTasks:', err);
        res.status(500).json({ message: 'Error al obtener las tareas del usuario' });
    }
};
