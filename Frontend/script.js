const ListaCategorias = document.getElementById("ListaCategorias")
const URL = "http://localhost:8001"
const endpointCategorias = URL + "/category"
const endpointProdutos = URL + "/product"

const formulario=document.getElementById("formcategoria")
const campoID= document.getElementById("idCat")
const campoNome= document.getElementById("txtNome")

async function loadCategorias(){
    try {
        const resposta = await fetch(endpointCategorias)
        if(!resposta.ok){
        alert("Erro ao carregar categorias")
        return
        }
            const categorias =await resposta.json()
            ListaCategorias.innerHTML = ""

            categorias.forEach(cat => {
                ListaCategorias.innerHTML += `

                <tr> 
                <td>  ${cat.id}  </td> 
                <td>  ${cat.nome}  </td>
                <td>
                <button class="btn btn-info" onclick="preencherformulario('${cat.id}','${cat.nome}')"
                >Editar</button>
                <button class="btn btn-danger" onclick="excluircategoria(${cat.id})">Excluir</button>
                </td>
                
                </tr>
            
                
                `
            })
    }catch(error) {
        console.error(error)
        alert("Deu ruim")
        }
    }
loadCategorias()

async function excluircategoria(id){
    const confirma = confirm("confirma exclusão?")
    if (!confirma) return

    try {
        const resposta = await fetch(`${endpointCategorias}/${id}`, {
            method: "DELETE"
        })
        if (resposta.ok){
            alert("Categoria excluida com sucesso")
            loadCategorias()
        }
    }catch(error){
        console.log(error)
        alert("Erro ao excluir categoria")
    }
}

function preencherformulario(idCat, txtNome){
    campoID.value = idCat
    campoNome.value = txtNome
}

formulario.addEventListener("submit", async function (evento){
    evento.preventDefault()
    const idCat = campoID.value
    const categoria = {
        nome: campoNome.value
    }
    try{
        if(idCat){
            await editarCategoria(idCat, categoria)
            alert("Categoria alterada com sucesso")
        }else{
            await addCategoria(categoria)
            alert("Categoria adicionada com sucesso")
        }
    }catch(error){
        console.log(error)
        alert("Erro ao adicionar ou alterar categoria")
    }

})
async function addCategoria(categoria){
    const resposta = await fetch(endpointCategorias,
{
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body:JSON.stringify(categoria)
})
    if (resposta.ok){
        loadCategorias()
    }
    return resposta.json()

}

async function editarCategoria(id, categoria){
    try{
        const resposta = await fetch(`${endpointCategorias}/${id}`, 
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        })
        if (resposta.ok){
            loadCategorias()
        }
    }catch(error){
        console.log(error)
        alert("Erro ao editar categoria")
    }
}
