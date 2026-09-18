const URL = "http://localhost:8001"
const endpointCategorias = URL + "/category"
const endpointProdutos = URL + "/product"
const ListaCategorias = document.getElementById("ListaCategorias")
const ListaProdutos = document.getElementById("ListaProdutos")
const formulario = document.getElementById("formcategoria")
const campoIDCat = document.getElementById("idCat")
const form_prod = document.getElementById("formproduto")
const campoIDProd = document.getElementById("idprod")
const campoPrecoProd = document.getElementById("txtPreco")
const tituloCategoria = document.getElementById("tituloCategoria")
const campoNome = document.getElementById("txtNome")
const parametros = new URLSearchParams(window.location.search)
const categoriaSelecionada = parametros.get("categoria")

async function loadCategorias(){
    try {
        const resposta = await fetch(endpointCategorias)
        if (!resposta.ok){
            alert("Erro ao carregar categorias")
            return
        }
        const categorias = await resposta.json()
        ListaCategorias.innerHTML = ""

        categorias.forEach(cat => {
            ListaCategorias.innerHTML += `
                <tr>
                    <td>${cat.id}</td>
                    <td>${cat.nome}</td>
                    <td>
                        <button class="btn btn-info" onclick="preencherFormularioCategoria('${cat.id}','${cat.nome}')">Editar</button>
                        <a class="btn btn-success" href="produto.html?categoria=${cat.id}" role="button">Produtos</a>
                        <button class="btn btn-danger" onclick="excluircategoria(${cat.id})">Excluir</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error(error)
        alert("Deu ruim")
    }
}

async function excluircategoria(id){
    const confirma = confirm("confirma exclusão?")
    if (!confirma) return

    try {
        const resposta = await fetch(`${endpointCategorias}/${id}`, { method: "DELETE" })
        if (resposta.ok){
            alert("Categoria excluida com sucesso")
            loadCategorias()
        }
    } catch (error){
        console.log(error)
        alert("Erro ao excluir categoria")
    }
}

async function addCategoria(categoria){
    const resposta = await fetch(endpointCategorias, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria)
    })
    if (resposta.ok){
        loadCategorias()
    }
    return resposta.json()
}

async function editarCategoria(id, categoria){
    try {
        const resposta = await fetch(`${endpointCategorias}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(categoria)
        })
        if (resposta.ok){
            loadCategorias()
        }
    } catch (error){
        console.log(error)
        alert("Erro ao editar categoria")
    }
}

function preencherFormularioCategoria(id, nome){
    campoIDCat.value = id
    campoNome.value = nome
}

if (formulario){
    formulario.addEventListener("submit", async function (evento){
        evento.preventDefault()
        const idCat = campoIDCat.value
        const categoria = { nome: campoNome.value }
        try {
            if (idCat){
                await editarCategoria(idCat, categoria)
                alert("Categoria alterada com sucesso")
            } else {
                await addCategoria(categoria)
                alert("Categoria adicionada com sucesso")
            }
            formulario.reset()
            campoIDCat.value = ""
        } catch (error){
            console.log(error)
            alert("Erro ao adicionar ou alterar categoria")
        }
    })
}

async function loadprodutos(){
    try {
        const resposta = await fetch(endpointProdutos)
        if (!resposta.ok){
            alert("Erro ao carregar produtos")
            return
        }
        let produtos = await resposta.json()

       if (categoriaSelecionada){
            produtos = produtos.filter(
                prod => String(prod.codCategoria) === String(categoriaSelecionada)
            )
        }

        ListaProdutos.innerHTML = ""
        produtos.forEach(prod => {
            ListaProdutos.innerHTML += `
                <tr>
                    <td>${prod.id}</td>
                    <td>${prod.nome}</td>
                    <td>${prod.preco}</td>
                    <td>
                        <button class="btn btn-info" onclick="preencherFormularioProduto('${prod.id}','${prod.nome}','${prod.preco}')">Editar</button>
                        <button class="btn btn-danger" onclick="excluirproduto(${prod.id})">Excluir</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error(error)
        alert("Deu ruim")
    }
}

async function excluirproduto(id){
    const confirma = confirm("confirma exclusão?")
    if (!confirma) return

    try {
        const resposta = await fetch(`${endpointProdutos}/${id}`, { method: "DELETE" })
        if (resposta.ok){
            alert("Produto excluido com sucesso")
            loadprodutos()
        }
    } catch (error){
        console.log(error)
        alert("Erro ao excluir produto")
    }
}

async function addProduto(produto){
    const resposta = await fetch(endpointProdutos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    })
    if (resposta.ok){
        loadprodutos()
    }
    return resposta.json()
}

async function editarProduto(id, produto){
    try {
        const resposta = await fetch(`${endpointProdutos}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(produto)
        })
        if (resposta.ok){
            loadprodutos()
        }
    } catch (error){
        console.log(error)
        alert("Erro ao editar produto")
    }
}

function preencherFormularioProduto(id, nome, preco){
    campoIDProd.value = id
    campoNome.value = nome
    if (campoPrecoProd) campoPrecoProd.value = preco
}

if (form_prod){
    form_prod.addEventListener("submit", async function (evento){
        evento.preventDefault()
        const idProd = campoIDProd.value
        const produto = {
            nome: campoNome.value,
            preco: parseFloat(campoPrecoProd.value)
        }
        
        if (!idProd && categoriaSelecionada){
            produto.codCategoria = Number(categoriaSelecionada)
        }
        try {
            if (idProd){
                await editarProduto(idProd, produto)
                alert("Produto alterado com sucesso")
            } else {
                await addProduto(produto)
                alert("Produto adicionado com sucesso")
            }
            form_prod.reset()
            campoIDProd.value = ""
        } catch (error){
            console.log(error)
            alert("Erro ao adicionar ou alterar produto")
        }
    })
}

async function mostrarNomeCategoria(){
    if (!tituloCategoria || !categoriaSelecionada) return
    try {
        const resposta = await fetch(`${endpointCategorias}/${categoriaSelecionada}`)
        if (resposta.ok){
            const cat = await resposta.json()
            tituloCategoria.textContent = `- ${cat.nome}`
        }
    } catch (error){
        console.log(error)
    }
}

if (ListaCategorias) loadCategorias()
if (ListaProdutos) {
    loadprodutos()
    mostrarNomeCategoria()
}