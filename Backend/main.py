from flask import Flask,render_template, request, jsonify, session, redirect, url_for
import config
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

app.config['SECRET_KEY'] = config.HEX_SEC_KEY
app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB

mysql = MySQL(app)

@app.route("/")
def raiz():
    return render_template("login.html")

## 111
# LOG in, Verificar usuario LISTO
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  

    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT id_cliente, nombre, apellidos, correo FROM cliente WHERE correo = %s AND contrasena = %s", (email, password))
    user = cur.fetchone()
    cur.close()

    if user:
        session['email'] = email
        session['id_cliente'] = user[0]

        return jsonify({
            "success": True,
            "user": {
                "id": user[0],
                "name": user[1],
                "lastName": user[2],
                "email": user[3]
            }
        })

    return jsonify({"success": False, "message": "Credenciales incorrectas"}), 401

# 111
# Añadir un nuevo usuario LISTO
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()  # Recibe JSON

    email = data.get('email')
    direccion = data.get('address')
    nombre = data.get('name')
    apellido = data.get('lastName')
    password = data.get('password')

    # Validación básica
    if not all([email, nombre, apellido, direccion, password]):
        return jsonify({"success": False, "message": "Datos incompletos"}), 400

    try:
        cur = mysql.connection.cursor()

        # Revisar si el correo ya existe
        cur.execute("SELECT id_cliente FROM cliente WHERE correo = %s", (email,))
        existe = cur.fetchone()
        if existe:
            return jsonify({"success": False, "message": "Correo ya registrado"}), 409

        sql = """INSERT INTO cliente (correo, direccion, nombre, apellidos, contrasena)
                 VALUES (%s, %s, %s, %s, %s)"""
        cur.execute(sql, (email, direccion, nombre, apellido, password))
        mysql.connection.commit()

        return jsonify({"success": True, "message": "Registrado correctamente"}), 201

    except Exception as e:
        mysql.connection.rollback()
        print("ERROR:", e)
        return jsonify({"success": False, "message": "Error en servidor"}), 500

    finally:
        cur.close()    

# Salir de sesion LISTO 
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({"message": "logged_out"}), 200
   
# Te envia a la pagina ya con el inicio de sesion
@app.route('/log', methods=['GET'])
def log():
    return render_template('agregarcarrito.html') # <<< Insertar pagina cuando esta logueado


# Ver informacion del usuario - Regreso la informacion del usuario
@app.route("/usuario", methods=["GET"])
def usuario():
    if 'id_cliente' not in session:
        return "No hay usuario logeado", 401

    id = session['id_cliente']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM cliente WHERE id_cliente = %s;", (id,))
    datos = cursor.fetchone()
    cursor.close()

    return render_template('datos.html', datos=datos)

# Buscar productos
@app.route("/productos", methods=["POST"])
def productos():
    Busqueda = request.form['producto']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM productos WHERE nombre REGEXP %s;", (Busqueda,))
    datos = cursor.fetchall()
    cursor.close()    
    if datos is not None:
        return render_template('datos.html', datos=datos)
    else:
        return render_template('noesta.html', datos=datos) # mensaje = No se reconoce el producto << Cambiar la pagina

# Buscar por categoria
@app.route("/categoria", methods=["POST"])
def categoria():
    Busqueda = request.form['categoria']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM productos WHERE categoria = %s;", (Busqueda,))
    datos = cursor.fetchall()
    cursor.close()    
    if datos:
        return render_template('datos.html', datos=datos)
    else:
        return render_template('noesta.html')

# Ve la informacion que tiene el usuario en el carrito PARCIALMENTE LISTO
@app.route("/carrito", methods=["GET"]) 
def carrito():
    # Validar sesión activa
    if 'id_cliente' not in session:
        return jsonify({"success": False, "message": "No hay usuario logeado"}), 401

    id_cliente = session['id_cliente']

    try:
        # Ejecutar la misma consulta
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT carrito.id_carrito, carrito.cantidad, 
                   productos.nombre, productos.precio, productos.categoria
            FROM carrito
            INNER JOIN productos ON carrito.id_producto = productos.id_producto
            WHERE carrito.id_cliente = %s;
        """, (id_cliente,))
        datos = cursor.fetchall()
        cursor.close()

        # Convertir los resultados en JSON
        carrito_items = []
        total = 0
        for item in datos:
            id_carrito = item[0]
            cantidad = item[1]
            nombre = item[2]
            precio = float(item[3])
            categoria = item[4]

            subtotal = precio * cantidad
            total += subtotal

            carrito_items.append({
                "id_carrito": id_carrito,
                "name": nombre,
                "price": precio,
                "category": categoria,
                "quantity": cantidad,
                "subtotal": subtotal
            })

        # Enviar JSON a React
        return jsonify({
            "success": True,
            "cart": carrito_items,
            "total": total
        }), 200

    except Exception as e:
        print("Error al obtener carrito:", e)
        return jsonify({
            "success": False,
            "message": "Error al obtener el carrito"
        }), 500


# Agregar cosas al carrito
@app.route("/AgreCarrito", methods=["POST"])
def AgreCarrito():
    if 'id_cliente' not in session:
        return "No hay usuario logeado", 401  # el usuario no ha iniciado sesión

    id_cliente = session['id_cliente']
    id_producto = request.form.get('producto')
    cantidad = request.form.get('cantidad')
    # --------- Esta parte se puede quitar si no se deja como casilla blanca 
    if not id_producto or not cantidad:
        return "Faltan datos", 400 

    # Convertir cantidad a entero
    try:
        cantidad = int(cantidad)
    except ValueError:
        return "La cantidad debe ser un número", 400
    # --------------
    try:
        cursor = mysql.connection.cursor()

        # Verificar si ya existe ese producto en el carrito del usuario
        cursor.execute("""
            SELECT cantidad FROM carrito WHERE id_cliente = %s AND id_producto = %s;
        """, (id_cliente, id_producto))
        existing = cursor.fetchone()

        if existing:
            # Si ya esta en el carrito, solo actualiza la cantidad
            cursor.execute("""
                UPDATE carrito SET cantidad = cantidad + %s
                WHERE id_cliente = %s AND id_producto = %s;
            """, (cantidad, id_cliente, id_producto))
        else:
            # Insertar nuevo registro
            cursor.execute("""
                INSERT INTO carrito (id_cliente, id_producto, cantidad)
                VALUES (%s, %s, %s);
            """, (id_cliente, id_producto, cantidad))

        mysql.connection.commit()
        cursor.close()

        return render_template('siesta.html')

    except Exception as e:
        mysql.connection.rollback()
        cursor.close()
        return f"Error al introducir en carrito: {e}", 500

    

# Comprar, se considera que recibe todas las opciones de su carrito, que esta marcado y va guardando los
#   valores en la tabla de compras
# Comprar productos del carrito
@app.route("/compra", methods=["GET"])
def compra():
    if 'id_cliente' not in session:
        return "No hay usuario logeado", 401

    id_cliente = session['id_cliente']

    cursor = mysql.connection.cursor()

    # Obtener datos del carrito con los precios de productos
    cursor.execute("""
        SELECT carrito.cantidad, productos.precio, carrito.id_producto
        FROM carrito
        INNER JOIN productos ON carrito.id_producto = productos.id_producto
        WHERE carrito.id_cliente = %s;
    """, (id_cliente,))
    datos = cursor.fetchall()
    # Sino tienen productos no realizar la accion 
    if len(datos) == 0:
        cursor.close()
        return "Carrito vacío" # Referenciar con carrito vacio

    # Calcular total de la compra
    total = sum(cantidad * precio for cantidad, precio, _ in datos)

    try:
        # 1. Insertar compra
        cursor.execute("INSERT INTO compras (id_cliente, total) VALUES (%s, %s);", (id_cliente, total))
        id_compra = cursor.lastrowid  # ID generado

        # 2. Insertar detalle de compra
        for cantidad, precio, id_producto in datos:
            cursor.execute("""
                INSERT INTO detalle_compra(id_compra, id_producto, cantidad, subtotal)
                VALUES (%s, %s, %s, %s);
            """, (id_compra, id_producto, cantidad, precio))

        # 3. Vaciar el carrito
        cursor.execute("DELETE FROM carrito WHERE id_cliente = %s;", (id_cliente,))

        mysql.connection.commit()
        cursor.close()

        return render_template('siesta.html')  # Pagina de compra exitosa

    except Exception as e:
        mysql.connection.rollback()  # Si algo falla, deshacer compra
        cursor.close()
        return f"Error en compra: {e}", 500


