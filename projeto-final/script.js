const apiKey = '73048647b7ea432dfd80c4d04b7d102c'
const filmesContainer = document.getElementById('filmesContainer')
const filmesSugestoes = document.getElementById('filmesSugestoes')


// PESQUISA
const lupa = document.querySelector('#lupa')
lupa.addEventListener('click', pesquisarFilme)

function pesquisarFilme() {
  filmesContainer.innerHTML = ''
  const inputPesquisa = document.querySelector('#pesquisa-input')
  const pesquisa = inputPesquisa.value

  if (pesquisa !== '') {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${pesquisa}&page=1&include_adult=false`)
      .then(response => response.json())
      .then(data => {
        const resultado = data.results
        const param = 'pesquisa'
        if (resultado.length == 0) {
          alert('Não foi encontrado filme com o título inserido.')
          inputPesquisa.value = ''
        }
        mostrarFilmes(resultado, param)
      })
      .catch(error => console.error('Error:', error))
  } else {
    alert('Nenhum termo de pesquisa foi inserido.')
  }
}

// EXIBIR FILMES NA TELA
function mostrarFilmes(filmes, param) {
  filmes.forEach(movie => {
    const title = movie.title
    const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

    const section = document.createElement('section')
    section.className = 'card'

    const img = document.createElement('img')
    img.src = posterPath
    img.className = 'capa'

    section.appendChild(img)

    const divCard = document.createElement('div')
    divCard.className = 'divCard'

    const titulo = document.createElement('h2')
    titulo.className = 'titulo'
    titulo.textContent = title

    let favoriteButton = document.createElement('button')
    favoriteButton.className = 'favoriteButton'

    divCard.appendChild(titulo);
    divCard.appendChild(favoriteButton);
    section.appendChild(divCard);

    if (param == 'favoritos') {
      // REMOVER DOS FAVORITOS (DELETE)
      favoriteButton.textContent = 'Remover dos favoritos'
      favoriteButton.addEventListener('click', () => {
        fetch(`http://localhost:3000/del/${movie.id}`, {
          method: "DELETE",
        })
        alert('Filme removido da lista de favoritos.')
      })
      const nota = document.createElement('textarea')
      nota.rows = '4'
      nota.cols = '50'
      nota.placeholder = 'Digite uma observação...'
      nota.className = 'nota'
      nota.value = movie.note || ''

      // ATUALIZAR ANOTAÇÃO (UPDATE)
      const salvarNota = document.createElement('button')
      salvarNota.textContent = 'Salvar nota'
      salvarNota.className = 'salvarNotaBtn'
      salvarNota.addEventListener('click', () => {
        const notaTexto = nota.value
        salvarNota(movie.id, notaTexto)
        function salvarNota(movieID, nota) {
          console.log(movieID)
          fetch(`http://localhost:3000/update/${movieID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ note: nota }),
          })
        alert('Nota salva.')
        }
      });

      divCard.appendChild(nota)
      divCard.appendChild(salvarNota)
    } else {
      // ADICIONAR AOS FAVORITOS (POST)
      favoriteButton.textContent = 'Adicionar aos favoritos'
      favoriteButton.addEventListener('click', () => {
        fetch("http://localhost:3000/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movie),
        })
        alert('Filme adicionado a lista de favoritos.')
      })
    }

    if (param == 'populares') {
      filmesSugestoes.appendChild(section)
    } else {
      filmesContainer.appendChild(section)
    }
  })
}


// MOSTRAR FAVORITOS (GET)
let mostrarFavoritosBtn = document.getElementById('mostrarFavoritosBtn')
mostrarFavoritosBtn.addEventListener('click', mostrarFavoritos)

function mostrarFavoritos() {
  filmesContainer.innerHTML = ''
  fetch("http://localhost:3000/")
    .then((result) => result.json())
    .then((data) => {
      if (data.response.length === 0) {
        document.querySelector('#lista-vazia').style.display = 'flex'
      } else {
        const param = 'favoritos'
        mostrarFilmes(data.response, param)
      }
    })
    .catch(error => console.error('Error:', error))
}



let filmesPopulares = []
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1&language=pt-BR`)
  .then(response => response.json())
  .then(data => {
    filmesPopulares = data.results.slice(0, 5)
    const param = 'populares'
    mostrarFilmes(filmesPopulares, param)
  })
  .catch(error => console.error('Error:', error))