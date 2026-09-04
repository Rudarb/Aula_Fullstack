const ListaCategorias = document.getElementById("ListaCategorias")
const URL = "http://localhost:8001"
const endpointCategorias = URL + "/category"

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
                <button class="btn btn-info" onclick="preecherformulario(${cat.id},${cat.nome})"
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