<template>

  <div>

    <nav
      class="navbar navbar-expand-lg bg-light border-bottom"
    >

      <div class="container">

        <RouterLink
          class="navbar-brand"
          to="/"
        >
          Library App
        </RouterLink>

        <div class="navbar-nav ms-auto">

          <RouterLink
            class="nav-link"
            to="/"
          >
            Home
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/about"
          >
            About
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/books"
          >
            Books
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/getbookcount"
          >
            Get Book Count
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/weather"
          >
            Get Weather
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/CountBookAPI"
          >
            Count Book API
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/GetAllBookAPI"
          >
            Get All Book API
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/FireRegister"
          >
            Firebase Register
          </RouterLink>

          <RouterLink
            class="nav-link"
            to="/FireLogin"
          >
            Firebase Login
          </RouterLink>

        </div>

      </div>

    </nav>

    <RouterView />

  </div>

</template>