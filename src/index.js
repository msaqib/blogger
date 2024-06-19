import './style.css';

let blogs = null
let tags = null
const main = document.querySelector('main')

document.addEventListener('DOMContentLoaded', () => {
  loadContent()
})

function navigateTo(path) {
  history.pushState(null, null, path)
  loadContent()
}

function createTopLevel() {
  main.innerHTML = `
  <div class="hero">
  <div class="main-message">
      <h1>In-depth Technical Articles</h1>
      <p>Information technology is a rapidly evolving field. There's something new every day. It is not easy keeping up with everything that's happening aruond us. We curate in-depth articles on the hottest technology trends, making us your one-stop resource for technical know-how.</p>
      <div class="button">Subscribe to our newsletter</div>
  </div>
  <div class="main-image">
      <img src="/assets/croods-1.svg">
  </div>
</div>
<div class="articles">
  <div class="blog-previews">
  </div>
  <div id="tags">
      <h2>Categories</h2>
  </div>
</div>
  `
}

function loadContent() {
  const path = window.location.pathname
  if (path === '/') {
    displayHomePage()
  }
  else if (path.startsWith('/blog/')) {
    const id = path.split('/')[2]
    displayBlog(id)
  }
  window.scrollTo(0, 0)
}

async function displayBlog(id) {
  if(!blogs || !tags) {
    await fetchData()
  }
  main.innerHTML = `<div id="blog-content"><img src="/assets/cover${blogs[id].cover}.jpeg"><h2>${blogs[id].title}</h2><p>Date: ${blogs[id].date}</p><p>${blogs[id].text}</p><button id="back">Back to blogs</button></div>`
  document.getElementById('back').addEventListener('click', () => navigateTo('/'))
}

async function fetchData() {
  const [blogsResponse, tagsResponse] = await Promise.all([fetch('http://localhost:3001/posts'), fetch('http://localhost:3001/tags')])
  blogs = await blogsResponse.json();
  tags = await tagsResponse.json();
  blogs.forEach(blog => {
    blog.cover = Math.floor(Math.random()*7) + 1
  })
}

async function displayHomePage() {
  createTopLevel()
  await fetchData()
  displayBlogPreviews(blogs)

  const tagsDiv = document.getElementById('tags')
  for (let tag of tags) {
    const d = document.createElement('div')
    d.innerText = tag.tag
    d.setAttribute('data-id', tag.id)
    d.style.cursor = 'pointer'
    d.addEventListener('click', (event) => {
      const targetId = event.target.getAttribute('data-id')
      const filteredBlogs = blogs.filter(blog => {
        const index = blog.tags.findIndex(id => id == targetId)
        return index !== -1
      })
      displayBlogPreviews(filteredBlogs)
    })
    tagsDiv.appendChild(d)
  }
}

function displayBlogPreviews(blogs) {
  const prev = document.querySelector('.blog-previews')
  prev.innerHTML = ''
  blogs.forEach(blog => {
    const blogElement = createBlogPreview(blog)
    prev.appendChild(blogElement)
  })
}

function createBlogPreview(data) {
  const b = document.createElement('div')
  b.classList.add('blog-preview')
  const img = document.createElement('img')
  img.src = '/assets/cover' + data.cover + '.jpeg'
  const h = document.createElement('h2')
  h.innerText = data.title
  const p = document.createElement('p')
  p.id = 'blog-text'
  p.innerText = data.text

  const button = document.createElement('div')
  button.classList.add('read-button')
  button.innerText = 'Read blog'

  button.setAttribute('data-path', `/blog/${data.id}`)
  button.addEventListener('click', event => {
      event.preventDefault()
      const path = event.target.getAttribute('data-path')
      navigateTo(path)
  })

  const date = document.createElement('div')
  date.classList.add('date')
  date.innerText = data.date
  b.appendChild(img)
  b.appendChild(h)
  b.appendChild(date)

  b.appendChild(button)
  return b
}