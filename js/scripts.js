'use strict';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CLASSES////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Servicio {
    constructor(id, nombre, precio, foto) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.foto = foto
    }

    mostrarServicio() {
        console.log("Nombre: " + this.nombre + "\nPrecio: " + this.precio)
    }
}

class Pedido {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////ARRAY DEFINITION///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const pedidos = []                                                                  //Array para los pedidos
const servicios = []                                                                //Array de Productos válidos


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////VARIABLES DEFINITION///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////
// Definiciones para tomar del DOM
/////

// Tomo contenedor de Cards ( container + Row)
const domContenedorServicios = document.getElementById('contenedor-servicios').getElementsByClassName('row');

// Tomo posicion del ROW en el HTML para la carga de Servicios
const domRowContenedorServicios = domContenedorServicios[0];

//Opcion alternativa de hacerlo en dos renglones con dos variables del dom
// const domContenedorProductos = document.getElementById('contenedor-servicios')
// const domContenedorRow = domContenedorProductos.getElementsByClassName('row');

// Se usa para el MODAL que esta dentro del carrito para tomar posicion
const domContenedorCarritoCompras = document.getElementById("items")

// Opcion Alternativa usando query selector
// const domContenedorCarritoCompras = document.querySelector("#items")

// Tomo posicion del boton para asignar el contador de pedidos al cart a medida que se van agregando servicios
const domBotonCompra = document.getElementById("botonCompra")


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////FUNCTIONS DEFINITION///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cargaServicios() {
    servicios.push(new Servicio(1, 'Dji Mavic 3', 3000, './img/DjiMavic3.jpg'));
    servicios.push(new Servicio(2, 'Dji Air 2S', 2850, './img/DjiAir2S.jpg'));
    servicios.push(new Servicio(3, 'Dji Mavic Air 2', 2700, './img/djidrone.jpg'));
    servicios.push(new Servicio(4, 'Dji Mini 3 Pro', 3200, './img/djidrone.jpg'));

}


function cargarCarrito() {
    let elementoCarrito = new Pedido(
        new Servicio(1, 'Dji Mavic 3', 3000, './img/DjiMavic3.jpg'),
        1
    );
    pedidos.push(elementoCarrito);
}

function dibujarCarrito() {
    let renglonesCarrito = '';

    pedidos.forEach(
        (renglon) => {
            renglonesCarrito += `
                <tr>
                    <td>${renglon.producto.id}</td>
                    <td>${renglon.producto.nombre}</td>
                    <td>${renglon.cantidad}</td>
                    <td>$ ${renglon.producto.precio}</td>
                </tr>
            `;
        }
    );

    domContenedorCarritoCompras.innerHTML = renglonesCarrito;
    domBotonCompra.innerText = pedidos.length

}

function crearCard(producto) {
// Defino Boton
    let botonAgregar = document.createElement("button")
    botonAgregar.className = "btn btn-outline-dark mt-auto justify-content-center"
    botonAgregar.innerText = "Agregar / Comprar"

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body p-4 justify-content-center";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} pesos argentinos</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.foto;
    imagen.className = "card-img-top";
    imagen.alt = producto.nombre;


    //Card
    let carta = document.createElement("div");
    carta.className = "card h-100 ";
    carta.append(imagen);
    carta.append(cuerpoCarta);


    //Contenedor Card
    let contenedorCarta = document.createElement("div");
    contenedorCarta.className = "col mb-5 justify-content-center";
    contenedorCarta.append(carta);



    //Eventos
    botonAgregar.onclick = () => {
        let elementoCarrito = new Pedido(producto,1)
        pedidos.push(elementoCarrito)
        dibujarCarrito()

    }

    return contenedorCarta
}

function dibujarCatalogoProductos() {
    domRowContenedorServicios.innerHTML = "";

    servicios.forEach(
        (servicio) => {
            let contenedorCarta = crearCard(servicio);
            domRowContenedorServicios.append(contenedorCarta);

        }
    );

}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////PROGRAM EXECUTION//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cargaServicios()
cargarCarrito()
dibujarCarrito()
dibujarCatalogoProductos()