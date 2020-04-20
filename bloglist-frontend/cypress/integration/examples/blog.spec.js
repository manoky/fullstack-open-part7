describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
      name: 'John Doe',
      username: 'jdoe1',
      password: 'something'
    }

    const user1 = {
      name: 'Tom Doe',
      username: 'tdoe1',
      password: 'something1'
    }

    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.request('POST', 'http://localhost:3001/api/users/', user1)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('input[name=username]').type('jdoe1')
      cy.get('input[name=password]').type('something')
      cy.get('#login').click()
      cy.get('html').should('contain', 'John Doe logged in')
        .contains('new blog')

    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('input[name=username]').type('jdoe1')
      cy.get('input[name=password]').type('notcorrect')
      cy.get('#login').click()
      cy.contains('Invalid username or password')
      cy.get('html').should('not.contain', 'John Doe logged in')
    })
  })

  describe('when logged in', function () {
    beforeEach(function() {
      cy.login({ username: 'jdoe1', password: 'something' })
    })

    it('A blog can be created', function() {
      cy.visit('http://localhost:3000')

      cy.contains('new blog').click()
      cy.get('#title').type('Python vs Java in 2020')
      cy.get('#author').type('Youssef Nader')
      cy.get('#url').type('https://hackr.io/blog/python-vs-java')

      cy.get('button').contains('create').click()
      cy.get('html').should('contain', 'a new blog Python vs Java in 2020 by Youssef Nader added')

    })

    it('Users can like a blog', function() {
      cy.createBlog({
        title: 'Python vs Java in 2020',
        author: 'Youssef Nader',
        url: 'https://hackr.io/blog/python-vs-java'
      })

      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('User can delete a blog if created by user', function() {
      cy.createBlog({
        title: 'Python vs Java in 2020',
        author: 'Youssef Nader',
        url: 'https://hackr.io/blog/python-vs-java'
      })

      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'Python vs Java in 2020 Youssef Nader')
    })

    it('User can not delete a blog if not created by user', function() {
      cy.createBlog({
        title: 'Python vs Java in 2020',
        author: 'Youssef Nader',
        url: 'https://hackr.io/blog/python-vs-java'
      })

      cy.contains('logout').click()
      cy.contains('login').click()
      cy.get('input[name=username]').type('tdoe1')
      cy.get('input[name=password]').type('something1')
      cy.get('#login').click()

      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('html').should('contain', 'You are not allowed to perform this operation')

    })

  })

  describe('Get all blogs', function() {
    beforeEach(function() {
      cy.login({ username: 'jdoe1', password: 'something' })

      cy.createBlog({
        title: 'Python vs Java in 2020',
        author: 'Youssef Nader',
        url: 'https://hackr.io/blog/python-vs-java',
        likes: 20
      })

      cy.createBlog({
        title: 'First Impressions of Fullstaq Ruby',
        author: 'Andrey Novikov',
        url: 'https://dev.to/evilmartians/fullstaq-ruby-first-impressions-and-how-to-migrate-your-docker-kubernetes-ruby-apps-today-4fm7',
        likes: 18
      })

      cy.createBlog({
        title: 'IPv4 vs IPv6: An Internet Protocol Story',
        author: 'Martin Aranovitch',
        url: 'https://premium.wpmudev.org/blog/ipv4-vs-ipv6/?utm_source=WPMU+DEV+Blog&utm_campaign=5c70de8406-hosting_month&utm_medium=email&utm_term=0_591b793ca5-5c70de8406-106250213',
        likes: 6
      })

    })

    it('blogs are sorted by likes', function () {
      cy.request('GET', 'http://localhost:3001/api/blogs')

      cy.get('.blog-details').then(blogs =>  {
        cy.wrap(blogs[0]).contains('likes 20')
        cy.wrap(blogs[1]).contains('likes 18')
        cy.wrap(blogs[2]).contains('likes 6')
      })
    })
  })

})