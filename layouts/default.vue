<template>
	<div class="container-fluid p-0">


		<header class="row no-gutters">
			<div class="ff-toolbar col">
				<nuxt-link :to="{name: 'index'}" class="logo-link">
					<img src="/logo.svg" alt="ff" class="normal-logo">
				</nuxt-link>

				<button v-if="$auth.loggedIn" v-on:click="$auth.logout() " class="ff_account_menu">
					Выход
				</button>
				<nuxt-link  v-else :to="{name: 'account-signin'}" class="ff_account_menu">
					Вход/Регистрация
				</nuxt-link>
			</div>
		</header>

    	<nuxt/>

		<footer class="ff-footer row justify-content-between" >
			<div class="d-none d-md-block col-md-8 ff-label"><span>Copyright &copy; FF.ru</span></div>

			<div class="social col-12 col-md-4">
				<a href="https://vk.com/cryptoff" class="social_link vk" alt="vk" target="_blank"></a>
				<a href="https://t.me/ff_ru" class="social_link tg" alt="tg" target="_blank"></a>
				<a href="https://twitter.com/www_FF_ru" class="social_link tr" alt="twitter" target="_blank"></a>
				<a href="https://fb.com/crypto.ff.ru/" class="social_link fb" alt="fb" target="_blank"></a>
			</div>
		</footer>

	</div>

</template>