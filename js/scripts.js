'use strict';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////CLASSES////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Servicio {
    constructor(id, nombre, precio, foto) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
    }

    mostrarServicio() {
        console.log("Nombre: " + this.nombre + "\nPrecio: " + this.precio);
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

let pedidos = [];                                                                  //Array para los pedidos
let servicios = [];                                                                //Array de Productos válidos


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////VARIABLES DEFINITION///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////
//Variables Globales de uso en el Sistema
///////

let sumaCarritoFinal = 0;

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
const domContenedorCarritoCompras = document.getElementById("items");

// Opcion Alternativa usando query selector
// const domContenedorCarritoCompras = document.querySelector("#items")

// Tomo posicion del boton para asignar el contador de pedidos al cart a medida que se van agregando servicios
const domBotonCompra = document.getElementById("botonCompra");

// Tomo posicion del footer de cada carrito de compra
const domFooterCarritoCompras = document.getElementById("footer");

// Tomo posicion del boton para finalizar compra
const domBotonFinalizarCompra = document.getElementById("btnfinalizarCompra");

// Tomo posicion del label para mostrar el valor total del pedido en el modal Finalizar compra
const domLabelFinalizarCompra = document.getElementById("valorFinalCarrito");


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////FUNCTIONS DEFINITION///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cargaServicios() {

    const URLJSON = "servicios.json"
    fetch(URLJSON)
        .then(respuesta => respuesta.json())            // llega en la variable servicios el POST del JSON local y lo convierte a objeto
        .then(servicios => dibujarCatalogoProductos(servicios))      // una vez está el fullfilled asigno esa promesa a servicios

   }


function dibujarCarrito() {
    let sumaCarrito = 0;
    domContenedorCarritoCompras.innerHTML = "";

    // Recupero Carrito de usuario en caso de que este guardado en local storage
    // Modifico a Operador ternario
    localStorage.getItem("carritoCompra") != null ? JSON.parse(localStorage.getItem("carritoCompra")) : console.log("Sin informacion previa en carrito");

    // if (localStorage.getItem("carritoCompra") != null){
    //     pedidos = JSON.parse(localStorage.getItem("carritoCompra"))
    // }

    pedidos.forEach(
        (renglon) => {
            let renglonesCarrito = document.createElement("tr");

            renglonesCarrito.innerHTML = `
                    <td>${renglon.producto.id}</td>
                    <td>${renglon.producto.nombre}</td>
                    <td><input id="cantidad-producto-${renglon.producto.id}" type="number" value="${renglon.cantidad}" min="1" max="1000" step="1" style="width: 50px;"/></td>
                    <td>${renglon.producto.precio}</td>
                    <td>$ ${renglon.producto.precio * renglon.cantidad}</td>
                    <td><button id="renglon-producto-${renglon.producto.id}" type="button" class="btn btn-dark"><i class="bi bi-trash-fill"></i></button></td>
                </tr>
            `;
            domContenedorCarritoCompras.append(renglonesCarrito);

            // Acumulo en la variable sumacarrito los valores de cara renglon de productos agregados al carrito.
            sumaCarrito += renglon.producto.precio * renglon.cantidad
            sumaCarritoFinal= sumaCarritoFinal+sumaCarrito


            // declaro una variable para tomar los datos de la cantidad elegida por el usuario
            let inputCantidadProductos = document.getElementById(`cantidad-producto-${renglon.producto.id}`)
            inputCantidadProductos.onchange = (ev) => {
                // Por defecto tomo el valor EV como evento del evento onchange que a su vez tiene las propiedades de target. value para el nuevo valor que adquiere.
                // let nuevaCantidad = ev.target.value;
                // renglon.cantidad = nuevaCantidad
                renglon.cantidad = ev.target.value;       // por redundante la opcion de definir la variable y tomar el evento, asigno lo que devuelve la funcion al renglon y llamo a dibujar nuevamente
                localStorage.setItem("carritoCompra", JSON.stringify(pedidos))
                dibujarCarrito();
            }

            // Acciones para el boton de Borrar renglon de producto
            let borrarProducto = document.getElementById(`renglon-producto-${renglon.producto.id}`);

            borrarProducto.onclick = () => {
                removerProductoCarrito(renglon);
                dibujarCarrito();
            };


        }
    );

    // Agrego la cantidad de productos agregados al boton de compra del html
    domBotonCompra.innerText = pedidos.length;

    // Muestro total del carrito
    if (pedidos.length == 0) {
        domFooterCarritoCompras.innerHTML = `
            <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
    } else {
        domFooterCarritoCompras.innerHTML = `
        <th scope="row" colSpan="5">Total de la compra $:  ${sumaCarrito} </th>
        `;
    }


}


function crearCard(producto) {
// Defino Boton
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-outline-dark mt-auto justify-content-center";
    botonAgregar.innerText = "Agregar / Comprar";

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
    contenedorCarta.className = "col mb-5";
    contenedorCarta.append(carta);


    //Eventos
    botonAgregar.onclick = () => {

        let elementoExistente = pedidos.find((renglon) => renglon.producto.id == producto.id);

        if (elementoExistente) {
            elementoExistente.cantidad += 1
        } else {
            let elementoCarrito = new Pedido(producto, 1);
            pedidos.push(elementoCarrito);

        }
        dibujarCarrito();

        // Agrego el Sweet Alert para modificar la relacion entre el carrito y el checkout agregando un alert cada vez que se agrega un producto
        swal({
            title: "¡Producto agregado!",
            text: `${producto.nombre} agregado al carrito de compra.`,
            icon: "success",
            buttons: {
                cerrar: {
                    text: "Cerrar",
                    value: false
                },
                carrito: {
                    text: "Ir a carrito",
                    value: true
                }
            }
        }).then((irACarrito) => {

            if (irACarrito) {
                //swal("Vamos al carrito!");
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: true});
                const modalToggle = document.getElementById('toggleMyModal');
                myModal.show(modalToggle);

            }
        });

        // Agrego el carrito al localstorage del Navegador
        localStorage.setItem("carritoCompra", JSON.stringify(pedidos));
        dibujarCarrito();

    }

    return contenedorCarta;
}

function dibujarCatalogoProductos(servicios) {
    domRowContenedorServicios.innerHTML = "";

    servicios.forEach(
        (servicio) => {
            let contenedorCarta = crearCard(servicio);
            domRowContenedorServicios.append(contenedorCarta);

        }
    );

}

function removerProductoCarrito(elementoAEliminar) {
    // uso el filter para la diferencia entre lo que esta en el array del carrito y tomo la diferencia con el id que quiero eliminar
    const elementosAMantener = pedidos.filter((renglon) => renglon.producto.id != elementoAEliminar.producto.id);

    // una forma de borrar algo es asignarle el lenght = 0, de esta forma el array de servicios quedaria vacio
    pedidos.length = 0;

    // asigno nuevamente al carrito los elementos del filtrado original
    elementosAMantener.forEach((renglon) => pedidos.push(renglon));

    localStorage.setItem("carritoCompra", JSON.stringify(pedidos))
}

function finalizarCarrito() {
    domBotonFinalizarCompra.onclick = () => {
        console.log(sumaCarritoFinal)
        domLabelFinalizarCompra.innerHTML = `Total de la compra $:  ${sumaCarritoFinal} `

    }


}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////PROGRAM EXECUTION//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cargaServicios();
dibujarCarrito();
//dibujarCatalogoProductos(servicios);
finalizarCarrito();