const db = require('../db/db');

class Evento{
       getEvents(req, res){
              const sql = `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre, f.imagen_url 
                         FROM Eventos a 
                         INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
                         INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
                         INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
                         INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
                         INNER JOIN Imagenes f ON a.evento_id = f.evento_id
                         ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))`;
              db.query(sql, (error, results) => {
              if (error) {
                  console.error("Error al realizar la consulta:", error);
                  res.status(500).json({ error: "Error al obtener datos de la base de datos" });
                  return;
              }
              res.json(results);
          });
       }
      
       //filtro por Categoría y tio de evento
        filtro (req, res) {
        const { category, tipo_evento } = req.query;
        
        const sql = `SELECT a.evento_id, a.nombre AS nombre_evento, a.fecha_inicio, a.fecha_termino, a.hora, a.ubicacion, a.max_per, a.estado, a.fecha_autorizacion, 
                            b.nombre AS tipo_evento, e.nombre AS organizador_nombre, e.nombre AS autorizado_nombre, c.estado, d.nombre AS categoria_nombre 
                     FROM Eventos a 
                     INNER JOIN Tipos_Evento b ON a.tipo_evento_id = b.tipo_evento_id  
                     INNER JOIN Validacion c ON a.validacion_id = c.validacion_id 
                     INNER JOIN Categorias d ON a.categoria_id = d.categoria_id
                     INNER JOIN Usuarios e ON a.organizador_id = e.usuario_id
                     WHERE d.nombre = ? OR b.nombre = ?
                     ORDER BY ABS(DATEDIFF(fecha_inicio, CURDATE()))`;

        db.query(sql, [category, tipo_evento], (error, results) => {
            if (error) {
                console.error("Error en la consulta", error);
                return res.status(500).json({ error: "Error en la consulta" });
            }
            if (results.length === 0) {
              if (category) {
                return res.status(404).json({ message: `No existen eventos para la categoria de evento ${category}` });  
              }else if (tipo_evento) {
                return res.status(404).json({ message: `No existen eventos para el tipo de evento ${tipo_evento}`});  
              }
          }
            res.json(results);
        });
    };
    
}
module.exports = new Evento