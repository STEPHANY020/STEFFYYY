/* =========================================================
   UMA — BIBLIOTECA CREATIVA
   ========================================================= */


/* ================= VARIABLES ================= */

let libros =
    JSON.parse(
        localStorage.getItem("UMA_LIBROS")
    ) || [];


let libroActual = null;

let capituloEditando = null;

let portadaActual = "";



/* ================= FUNCIONES BÁSICAS ================= */

function guardarDatos() {

    localStorage.setItem(
        "UMA_LIBROS",
        JSON.stringify(libros)
    );

    actualizarEstadisticas();
}



function generarID() {

    return (
        Date.now() +
        Math.random()
            .toString(36)
            .substring(2)
    );

}



function mostrarMensaje(mensaje) {

    const toast =
        document.getElementById("toast");

    toast.textContent = mensaje;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}



/* ================= CAMBIAR PÁGINAS ================= */

const botonesNav =
    document.querySelectorAll(".nav-btn");


botonesNav.forEach(boton => {

    boton.addEventListener("click", () => {

        cambiarVista(
            boton.dataset.view
        );

    });

});



function cambiarVista(vista) {

    document
        .querySelectorAll(".view")
        .forEach(seccion => {

            seccion.classList.remove("active");

        });


    document
        .getElementById(
            vista + "View"
        )
        .classList.add("active");


    const nombres = {

        inicio: "Inicio",

        libros: "Mis libros",

        crear: "Crear libro",

        editor: "Editor del libro"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        nombres[vista];


    botonesNav.forEach(boton => {

        boton.classList.toggle(
            "active",
            boton.dataset.view === vista
        );

    });

}



/* ================= BOTONES CREAR ================= */

document
    .getElementById("nuevoLibro")
    .onclick = abrirCrearLibro;


document
    .getElementById("comenzarBtn")
    .onclick = abrirCrearLibro;


document
    .getElementById("crearDesdeLibros")
    .onclick = abrirCrearLibro;


document
    .getElementById("crearPrimerLibro")
    .onclick = abrirCrearLibro;



function abrirCrearLibro() {

    document
        .getElementById("formLibro")
        .reset();


    portadaActual = "";


    document
        .getElementById("previewPortada")
        .innerHTML = `

            <span>＋</span>

            <strong>
                Subir portada
            </strong>

            <small>
                JPG, PNG o WEBP
            </small>

        `;


    cambiarVista("crear");

}



/* ================= PORTADA ================= */

document
    .getElementById("portada")
    .addEventListener(
        "change",
        function(e) {

            const archivo =
                e.target.files[0];

            if (!archivo) return;


            const lector =
                new FileReader();


            lector.onload = function() {

                portadaActual =
                    lector.result;


                document
                    .getElementById(
                        "previewPortada"
                    )
                    .innerHTML = `

                        <img
                            src="${portadaActual}"
                        >

                    `;

            };


            lector.readAsDataURL(
                archivo
            );

        }
    );



/* ================= CREAR LIBRO ================= */

document
    .getElementById("formLibro")
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const libro = {

                id: generarID(),

                titulo:
                    document
                        .getElementById(
                            "titulo"
                        )
                        .value
                        .trim(),

                autor:
                    document
                        .getElementById(
                            "autor"
                        )
                        .value
                        .trim(),

                descripcion:
                    document
                        .getElementById(
                            "descripcion"
                        )
                        .value
                        .trim(),

                sinopsis:
                    document
                        .getElementById(
                            "sinopsis"
                        )
                        .value
                        .trim(),

                portada:
                    portadaActual,

                capitulos: [],

                fecha:
                    new Date()
                        .toISOString()

            };


            libros.unshift(libro);


            guardarDatos();


            mostrarMensaje(
                "Libro guardado correctamente ✦"
            );


            renderizarLibros();


            abrirLibro(
                libro.id
            );

        }
    );



/* ================= MOSTRAR LIBROS ================= */

function renderizarLibros() {

    const grid =
        document.getElementById(
            "librosGrid"
        );


    const vacio =
        document.getElementById(
            "sinLibros"
        );


    grid.innerHTML = "";


    if (libros.length === 0) {

        vacio.style.display =
            "block";

        return;

    }


    vacio.style.display =
        "none";


    libros.forEach(libro => {

        const tarjeta =
            document.createElement(
                "article"
            );


        tarjeta.className =
            "book-card";


        tarjeta.innerHTML = `

            <div class="book-cover">

                ${
                    libro.portada

                    ?

                    `<img
                        src="${libro.portada}"
                    >`

                    :

                    `

                    <div class="cover-text">

                        <small>
                            UMA
                        </small>

                        <strong>
                            ${escapar(
                                libro.titulo
                            )}
                        </strong>

                        <small>
                            ${escapar(
                                libro.autor
                            )}
                        </small>

                    </div>

                    `
                }

            </div>


            <div class="book-body">

                <h4>
                    ${escapar(
                        libro.titulo
                    )}
                </h4>


                <p>

                    ${escapar(
                        libro.autor
                    )}

                    ·

                    ${libro.capitulos.length}

                    capítulo(s)

                </p>


                <div class="actions">

                    <button
                        class="small-btn abrir"
                    >
                        Abrir
                    </button>


                    <button
                        class="small-btn editar"
                    >
                        Editar
                    </button>


                    <button
                        class="small-btn pdf"
                    >
                        PDF
                    </button>


                    <button
                        class="small-btn compartir"
                    >
                        Compartir
                    </button>


                    <button
                        class="small-btn danger borrar"
                    >
                        Borrar
                    </button>

                </div>

            </div>

        `;


        tarjeta
            .querySelector(".abrir")
            .onclick = () =>
                abrirLibro(libro.id);


        tarjeta
            .querySelector(".editar")
            .onclick = () =>
                editarLibro(libro.id);


        tarjeta
            .querySelector(".pdf")
            .onclick = () =>
                descargarPDF(libro.id);


        tarjeta
            .querySelector(".compartir")
            .onclick = () =>
                compartirPDF(libro.id);


        tarjeta
            .querySelector(".borrar")
            .onclick = () =>
                borrarLibro(libro.id);


        grid.appendChild(
            tarjeta
        );

    });

}



/* ================= EDITAR LIBRO ================= */

function editarLibro(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    document
        .getElementById("titulo")
        .value =
        libro.titulo;


    document
        .getElementById("autor")
        .value =
        libro.autor;


    document
        .getElementById("descripcion")
        .value =
        libro.descripcion;


    document
        .getElementById("sinopsis")
        .value =
        libro.sinopsis;


    portadaActual =
        libro.portada || "";


    if (portadaActual) {

        document
            .getElementById(
                "previewPortada"
            )
            .innerHTML = `

                <img
                    src="${portadaActual}"
                >

            `;

    }


    document
        .getElementById(
            "formLibro"
        )
        .onsubmit =
        function(e) {

            e.preventDefault();


            libro.titulo =
                document
                    .getElementById(
                        "titulo"
                    )
                    .value
                    .trim();


            libro.autor =
                document
                    .getElementById(
                        "autor"
                    )
                    .value
                    .trim();


            libro.descripcion =
                document
                    .getElementById(
                        "descripcion"
                    )
                    .value
                    .trim();


            libro.sinopsis =
                document
                    .getElementById(
                        "sinopsis"
                    )
                    .value
                    .trim();


            libro.portada =
                portadaActual;


            guardarDatos();


            renderizarLibros();


            mostrarMensaje(
                "Libro actualizado ✦"
            );


            document
                .getElementById(
                    "formLibro"
                )
                .onsubmit = null;


            abrirLibro(id);

        };


    cambiarVista("crear");

}



/* ================= BORRAR LIBRO ================= */

function borrarLibro(id) {

    const confirmar =
        confirm(
            "¿Seguro que quieres borrar este libro y todos sus capítulos?"
        );


    if (!confirmar) return;


    libros =
        libros.filter(
            libro =>
                libro.id !== id
        );


    guardarDatos();


    renderizarLibros();


    mostrarMensaje(
        "Libro eliminado"
    );

}



/* ================= ABRIR LIBRO ================= */

function abrirLibro(id) {

    const libro =
        libros.find(
            l => l.id === id
        );


    if (!libro) return;


    libroActual =
        id;


    capituloEditando =
        null;


    document
        .getElementById(
            "nombreLibroEditor"
        )
        .textContent =
        libro.titulo;


    const miniCover =
        document.getElementById(
            "miniCover"
        );


    miniCover.style.backgroundImage =
        libro.portada
        ?
        `url("${libro.portada}")`
        :
        "none";


    limpiarEditor();


    renderizarCapitulos();


    cambiarVista(
        "editor"
    );

}



/* ================= NUEVO CAPÍTULO ================= */

document
    .getElementById(
        "nuevoCapitulo"
    )
    .onclick =
    limpiarEditor;



function limpiarEditor() {

    capituloEditando =
        null;


    document
        .getElementById(
            "modoCapitulo"
        )
        .textContent =
        "Crear capítulo";


    document
        .getElementById(
            "tituloCapitulo"
        )
        .value = "";


    document
        .getElementById(
            "textoCapitulo"
        )
        .innerHTML = "";


    document
        .getElementById(
            "contadorPalabras"
        )
        .textContent =
        "0 palabras";

}



/* ================= GUARDAR CAPÍTULO ================= */

document
    .getElementById(
        "guardarCapitulo"
    )
    .onclick =
    guardarCapitulo;



function guardarCapitulo() {

    const libro =
        libros.find(
            l =>
                l.id ===
                libroActual
        );


    if (!libro) return;


    const titulo =
        document
            .getElementById(
                "tituloCapitulo"
            )
            .value
            .trim();


    const texto =
        document
            .getElementById(
                "textoCapitulo"
            )
            .innerHTML
            .trim();


    if (!titulo) {

        mostrarMensaje(
            "Escribe el título del capítulo"
        );

        return;

    }


    if (!texto) {

        mostrarMensaje(
            "Escribe el contenido del capítulo"
        );

        return;

    }


    if (capituloEditando) {

        const capitulo =
            libro.capitulos.find(
                c =>
                    c.id ===
                    capituloEditando
            );


        capitulo.titulo =
            titulo;


        capitulo.texto =
            texto;

    }

    else {

        libro.capitulos.push({

            id:
                generarID(),

            titulo:
                titulo,

            texto:
                texto,

            fecha:
                new Date()
                    .toISOString()

        });

    }


    guardarDatos();


    renderizarCapitulos();


    mostrarMensaje(
        "Capítulo guardado ✦"
    );


    limpiarEditor();

}



/* ================= MOSTRAR CAPÍTULOS ================= */

function renderizarCapitulos() {

    const libro =
        libros.find(
            l =>
                l.id ===
                libroActual
        );


    if (!libro) return;


    const grid =
        document.getElementById(
            "capitulosGrid"
        );


    const vacio =
        document.getElementById(
            "sinCapitulos"
        );


    grid.innerHTML = "";


    if (
        libro.capitulos.length === 0
    ) {

        vacio.style.display =
            "block";

        return;

    }


    vacio.style.display =
        "none";


    libro.capitulos.forEach(
        (capitulo,index) => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "chapter-card";


            const textoPlano =
                quitarHTML(
                    capitulo.texto
                );


            tarjeta.innerHTML = `

                <div class="chapter-number">

                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}

                </div>


                <h4>

                    ${escapar(
                        capitulo.titulo
                    )}

                </h4>


                <p>

                    ${escapar(
                        textoPlano.substring(
                            0,
                            100
                        )
                    )}

                    ${
                        textoPlano.length > 100
                        ? "..."
                        : ""
                    }

                </p>


                <div class="chapter-actions">

                    <button
                        class="small-btn editarCap"
                    >
                        Editar
                    </button>


                    <button
                        class="small-btn pdfCap"
                    >
                        PDF
                    </button>


                    <button
                        class="small-btn danger borrarCap"
                    >
                        Borrar
                    </button>

                </div>

            `;


            tarjeta
                .querySelector(
                    ".editarCap"
                )
                .onclick = () =>
                    editarCapitulo(
                        capitulo.id
                    );


            tarjeta
                .querySelector(
                    ".pdfCap"
                )
                .onclick = () =>
                    descargarPDF(
                        libro.id,
                        capitulo.id
                    );


            tarjeta
                .querySelector(
                    ".borrarCap"
                )
                .onclick = () =>
                    borrarCapitulo(
                        capitulo.id
                    );


            grid.appendChild(
                tarjeta
            );

        }
    );

}



/* ================= EDITAR CAPÍTULO ================= */

function editarCapitulo(id) {

    const libro =
        libros.find(
            l =>
                l.id ===
                libroActual
        );


    const capitulo =
        libro.capitulos.find(
            c =>
                c.id === id
        );


    if (!capitulo) return;


    capituloEditando =
        id;


    document
        .getElementById(
            "modoCapitulo"
        )
        .textContent =
        "Editar capítulo";


    document
        .getElementById(
            "tituloCapitulo"
        )
        .value =
        capitulo.titulo;


    document
        .getElementById(
            "textoCapitulo"
        )
        .innerHTML =
        capitulo.texto;


    actualizarContador();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* ================= BORRAR CAPÍTULO ================= */

function borrarCapitulo(id) {

    const confirmar =
        confirm(
            "¿Quieres borrar este capítulo?"
        );


    if (!confirmar) return;


    const libro =
        libros.find(
            l =>
                l.id ===
                libroActual
        );


    libro.capitulos =
        libro.capitulos.filter(
            c =>
                c.id !== id
        );


    guardarDatos();


    renderizarCapitulos();


    mostrarMensaje(
        "Capítulo eliminado"
    );

}



/* ================= EDITOR WORD ================= */

document
    .querySelectorAll(
        ".toolbar button"
    )
    .forEach(
        boton => {

            boton.addEventListener(
                "click",
                function() {

                    document.execCommand(
                        this.dataset.command,
                        false,
                        null
                    );


                    document
                        .getElementById(
                            "textoCapitulo"
                        )
                        .focus();

                }
            );

        }
    );



/* ================= FUENTE ================= */

document
    .getElementById(
        "fuente"
    )
    .addEventListener(
        "change",
        function() {

            document.execCommand(
                "fontName",
                false,
                this.value
            );

        }
    );



/* ================= TAMAÑO ================= */

document
    .getElementById(
        "tamano"
    )
    .addEventListener(
        "change",
        function() {

            document.execCommand(
                "fontSize",
                false,
                "7"
            );


            const fuentes =
                document.querySelectorAll(
                    "#textoCapitulo font[size='7']"
                );


            fuentes.forEach(
                fuente => {

                    fuente.removeAttribute(
                        "size"
                    );


                    fuente.style.fontSize =
                        this.value + "pt";

                }
            );

        }
    );



/* ================= CONTADOR ================= */

document
    .getElementById(
        "textoCapitulo"
    )
    .addEventListener(
        "input",
        actualizarContador
    );


function actualizarContador() {

    const texto =
        document
            .getElementById(
                "textoCapitulo"
            )
            .innerText
            .trim();


    const palabras =
        texto
            ?
            texto
                .split(/\s+/)
                .filter(Boolean)
                .length
            :
            0;


    document
        .getElementById(
            "contadorPalabras"
        )
        .textContent =
        palabras +
        (
            palabras === 1
            ? " palabra"
            : " palabras"
        );

}



/* ================= NORMAS APA ================= */

document
    .getElementById(
        "apa"
    )
    .onclick =
    function() {

        const editor =
            document.getElementById(
                "textoCapitulo"
            );


        editor.style.fontFamily =
            "Times New Roman";


        editor.style.fontSize =
            "12pt";


        editor.style.lineHeight =
            "2";


        mostrarMensaje(
            "Formato APA aplicado ✦"
        );

    };



/* ================= PDF ================= */

function descargarPDF(
    libroID,
    capituloID = null
) {

    const libro =
        libros.find(
            l =>
                l.id === libroID
        );


    if (!libro) return;


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    const margen = 25;


    /* PORTADA */

    pdf.setFillColor(
        43,
        37,
        33
    );


    pdf.rect(
        0,
        0,
        210,
        297,
        "F"
    );


    pdf.setTextColor(
        255,
        255,
        255
    );


    pdf.setFont(
        "times",
        "bold"
    );


    pdf.setFontSize(30);


    pdf.text(
        libro.titulo,
        margen,
        95,
        {
            maxWidth: 160
        }
    );


    pdf.setFont(
        "times",
        "normal"
    );


    pdf.setFontSize(13);


    pdf.text(
        "Por " + libro.autor,
        margen,
        120
    );


    pdf.setFontSize(9);


    pdf.text(
        "UMA · Biblioteca creativa",
        margen,
        270
    );


    /* SINOPSIS */

    pdf.addPage();


    pdf.setTextColor(
        43,
        37,
        33
    );


    pdf.setFont(
        "times",
        "bold"
    );


    pdf.setFontSize(20);


    pdf.text(
        "Sinopsis",
        margen,
        35
    );


    pdf.setFont(
        "times",
        "normal"
    );


    pdf.setFontSize(12);


    escribirPDF(
        pdf,
        libro.sinopsis ||
        libro.descripcion ||
        "Sinopsis no disponible.",
        margen,
        52
    );


    /* CAPÍTULOS */

    let capitulos =
        libro.capitulos;


    if (capituloID) {

        capitulos =
            capitulos.filter(
                c =>
                    c.id ===
                    capituloID
            );

    }


    capitulos.forEach(
        (capitulo,index) => {

            pdf.addPage();


            pdf.setTextColor(
                43,
                37,
                33
            );


            pdf.setFont(
                "times",
                "bold"
            );


            pdf.setFontSize(20);


            pdf.text(
                capitulo.titulo,
                margen,
                35
            );


            pdf.setFont(
                "times",
                "normal"
            );


            pdf.setFontSize(12);


            escribirPDF(
                pdf,
                quitarHTML(
                    capitulo.texto
                ),
                margen,
                52
            );


            pdf.setFontSize(9);


            pdf.setTextColor(
                130,
                120,
                112
            );


            pdf.text(
                `Capítulo ${
                    index + 1
                } · ${libro.titulo}`,
                margen,
                285
            );

        }
    );


    const nombre =
        libro.titulo
            .replace(
                /[^\w\s-]/g,
                ""
            )
            .trim();


    pdf.save(
        `${nombre || "libro"}.pdf`
    );


    mostrarMensaje(
        "PDF generado correctamente ✦"
    );

}



/* ================= TEXTO PDF ================= */

function escribirPDF(
    pdf,
    texto,
    x,
    y
) {

    const lineas =
        pdf.splitTextToSize(
            texto,
            160
        );


    let posicionY = y;


    lineas.forEach(
        linea => {

            if (
                posicionY >
                270
            ) {

                pdf.addPage();

                posicionY = 30;

            }


            pdf.text(
                linea,
                x,
                posicionY
            );


            posicionY += 8;

        }
    );

}



/* ================= COMPARTIR ================= */

async function compartirPDF(id) {

    const libro =
        libros.find(
            l =>
                l.id === id
        );


    if (!libro) return;


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        crearPDFBlob(libro);


    const archivo =
        new File(
            [pdf],
            `${libro.titulo}.pdf`,
            {
                type:
                    "application/pdf"
            }
        );


    if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
            files: [archivo]
        })
    ) {

        try {

            await navigator.share({

                title:
                    libro.titulo,

                text:
                    "Te comparto mi libro creado en UMA.",

                files:
                    [archivo]

            });

        }

        catch(error) {

            console.log(error);

        }

    }

    else {

        const url =
            URL.createObjectURL(
                pdf
            );


        window.open(
            url,
            "_blank"
        );


        mostrarMensaje(
            "PDF abierto para compartir"
        );

    }

}



/* ================= CREAR BLOB PDF ================= */

function crearPDFBlob(libro) {

    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    pdf.setFillColor(
        43,
        37,
        33
    );


    pdf.rect(
        0,
        0,
        210,
        297,
        "F"
    );


    pdf.setTextColor(
        255,
        255,
        255
    );


    pdf.setFont(
        "times",
        "bold"
    );


    pdf.setFontSize(30);


    pdf.text(
        libro.titulo,
        25,
        95,
        {
            maxWidth: 160
        }
    );


    pdf.setFont(
        "times",
        "normal"
    );


    pdf.setFontSize(13);


    pdf.text(
        "Por " + libro.autor,
        25,
        120
    );


    libro.capitulos.forEach(
        capitulo => {

            pdf.addPage();


            pdf.setTextColor(
                43,
                37,
                33
            );


            pdf.setFont(
                "times",
                "bold"
            );


            pdf.setFontSize(20);


            pdf.text(
                capitulo.titulo,
                25,
                35
            );


            pdf.setFont(
                "times",
                "normal"
            );


            pdf.setFontSize(12);


            escribirPDF(
                pdf,
                quitarHTML(
                    capitulo.texto
                ),
                25,
                52
            );

        }
    );


    return pdf.output(
        "blob"
    );

}



/* ================= UTILIDADES ================= */

function quitarHTML(html) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.innerHTML =
        html;


    return elemento
        .innerText
        .replace(
            /\n{3,}/g,
            "\n\n"
        );

}



function escapar(texto) {

    return String(
        texto || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* ================= ESTADÍSTICAS ================= */

function actualizarEstadisticas() {

    document
        .getElementById(
            "cantidadLibros"
        )
        .textContent =
        libros.length;


    const totalCapitulos =
        libros.reduce(
            (
                total,
                libro
            ) =>
                total +
                libro.capitulos.length,
            0
        );


    document
        .getElementById(
            "cantidadCapitulos"
        )
        .textContent =
        totalCapitulos;


    document
        .getElementById(
            "ultimoLibro"
        )
        .textContent =
        libros.length
        ?
        libros[0].titulo
        :
        "—";

}



/* ================= VOLVER ================= */

document
    .getElementById(
        "volverLibros"
    )
    .onclick =
    function() {

        renderizarLibros();

        cambiarVista(
            "libros"
        );

    };



/* ================= CANCELAR ================= */

document
    .getElementById(
        "cancelarLibro"
    )
    .onclick =
    abrirLibros;


document
    .getElementById(
        "cancelarLibro2"
    )
    .onclick =
    abrirLibros;



function abrirLibros() {

    renderizarLibros();

    cambiarVista(
        "libros"
    );

}



/* ================= INICIAR ================= */

renderizarLibros();

actualizarEstadisticas();