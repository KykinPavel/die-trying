<template>
  <header class="header">
    <section class="top-bar">
      <h2 class="visually-hidden">
        Top bar
      </h2>
      <span class="top-bar__info">special deals <a class="top-bar__link" href="/public">link</a></span>
      <ul class="top-links">
        <li class="top-links__item">
          <a class="top-links__link">first</a>
        </li>
        <li class="top-links__item">
          <a class="top-links__link">second</a>
        </li>
        <li class="top-links__item">
          <a class="top-links__link">third</a>
        </li>
        <li class="top-links__item">
          <a class="top-links__link">fourth</a>
        </li>
      </ul>
    </section>
    <nav class="main-navigation">
      <div class="logo">
        <a href="/public"><img src="/logo.png" alt="ГдеМатериал.Ру"></a> <!--TODO(iNerV) do dynamically link-->
      </div>
      <div class="main-navigation__burger">
        <button class="main-navigation__open-menu-btn">
          Menu
        </button>
      </div>
      <div class="main-navigation__search">
        <input class="main-navigation__input" type="search" placeholder="search">
      </div>
      <ul class="user-box">
        <li class="user-box__item">
          <a class="user-box__link" href="#user">user</a>
        </li>
        <li class="user-box__item">
          <a class="user-box__link" href="#basket">basket</a>
        </li>
      </ul>
    </nav>
    <ul class="site-navigation">
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category2</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category3</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category4</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category5</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category6</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category7</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category8</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category9</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category10</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category11</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category12</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category13</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category14</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category15</a>
      </li>
      <li class="site-navigation__item">
        <a class="site-navigation__link" href="/public">Category16</a>
      </li>
    </ul>
  </header>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@import '~/assets/variables.scss';

.top-bar {
  display: flex;
  justify-content: space-between;
  background-color: rgb(96, 4, 186);
  color: rgb(255, 255, 255);
  font-size: .875rem;
  font-weight: 600;
  line-height: 19px;
  padding: .25rem 1rem;
  z-index: 2;

  &__info {
    font-weight: 900;
  }

  &__link {
    font-weight: normal;
  }
}

.top-links {
  display: flex;
  list-style-type: none;

  &__items {
    display: flex;
    padding: 0;
    list-style-type: none;
    font-size: .875rem;
    line-height: 19px;
  }

  &__item:not(:first-child) {
    margin-left: 15px;
  }
}

.main-navigation {
  display: grid;
  align-items: center;
  grid-template-areas:
    "burger logo user-box"
    "search search search";
  grid-template-columns: 100px 100px 1fr;
  grid-template-rows: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  background-color: rgb(130, 0, 255);
  color: rgb(255, 255, 255);
  z-index: 1;
  line-height: 2.5rem;

  @media (min-width: $screen-md) {
    grid-template-areas: "logo burger search user-box";
    grid-template-columns: 100px 100px 4fr 1fr;
    grid-gap: 1rem;
    height: 57px;
  }

  &__burger {
    grid-area: burger;
  }

  &__open-menu-btn {
    background: transparent;
    padding: .5rem 1.5rem;
    display: inline-block;
    border: 1px solid rgb(255, 255, 255);
    border-radius: 2px;
    position: relative;
    color: rgb(255, 255, 255);
    z-index: 1;
  }

  &__search {
    grid-area: search;
    color: rgb(68, 68, 68);
  }

  &__input {
    width: 100%;
    height: 38px;
    text-align: left;
    overflow: hidden;
    padding: .45rem 1.5rem .45rem .5rem;
    line-height: 24px;
  }
}

.user-box {
  display: flex;
  justify-content: flex-end;
  list-style-type: none;

  &__items {
    display: flex;
    padding: 0;
    list-style-type: none;
    font-size: .875rem;
    line-height: 19px;
  }

  &__item:not(:first-child) {
    margin-left: 15px;
  }
}

.site-navigation {
  display: flex;
  flex-direction: column;
  grid-area: site-navigation;
  list-style-type: none;
  width: 100%;
  height: calc(100vh - 153px);
  background: rgb(255, 255, 255);
  overflow-y: scroll;
  z-index: 1;
  padding-left: 0;
  display: none;

  &__item {
    display: block;
    width: 100%;
    height: 47px;
    position: relative;
    color: #333;
    padding: .75rem 1rem;

    &:hover,
    &:active {
      background-color: rgb(130, 0, 255);
      color: rgb(255, 255, 255);
    }
  }

  &__grid {
    display: grid;
    grid-template-rows: 90px 90px;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    list-style-type: none;
    padding: 0;
  }

  &__grid-item {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    text-align: center;
    color: rgb(130, 0, 255);
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  &__link {
    display: block;
    width: 100%;
    color: inherit;

    &:hover,
    &:active {
      color: rgb(255, 255, 255);
    }

    &--special {
      display: flex;
      align-items: center;
      position: absolute;
      padding-left: 50%;
      left: -10%;
      height: 100%;

      &:hover,
      &:active {
        color: inherit;
      }
    }
  }
}
</style>
