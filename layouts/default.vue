<template>
	<div class="container-fluid p-0">


		<header class="row no-gutters">
			<div class="ff-toolbar col">
				<nuxt-link 
					@click.native="sendEvent( 'Toolbar', 'click', 'home' )" 
					:to="{name: 'index'}" 
					class="logo-link"
					>
					<img src="/logo.svg" alt="ff" class="normal-logo">
				</nuxt-link>

				<nav>
					<nuxt-link 
						@click.native="sendEvent( 'Toolbar', 'click', 'курс биткоина' )" 
						:to="{name: 'index'}" 
						class="nav-link"
						>
						Курс биткоина
					</nuxt-link>
					<nuxt-link 
						@click.native="sendEvent( 'Toolbar', 'click', 'Купить биткоин' )" 
						:to="{path: '/wiki/1'}" 
						class="nav-link"
						>
						Купить биткоин
					</nuxt-link>
					<a href="https://t.me/FF_RUS" class="tg_banner_2" target="_blank">
							<span class="ic_telegram_white"></span>
							<span class="text">
								TELEGRAM<br/>
								<small>10250 подписчиков</small>
							</span>
					</a>

				</nav>

				<button 
					v-if="$auth.loggedIn" 
					v-on:click="$auth.logout() " 
					class="ff_account_menu"
					>
					Выход
				</button>
				<nuxt-link 
					@click.native="sendEvent( 'Toolbar', 'click', 'auth' )" 
					v-else :to="{ name: 'account-signin' }" 
					class="ff_account_menu">
					Вход/Регистрация
				</nuxt-link>
			</div>
		</header>

    	<nuxt/>

		<footer class="ff-footer row justify-content-between" >
			<div class="d-none d-md-block col-md-2 ff-label"><span>Copyright &copy; FF.ru</span></div>

			<div class="d-none d-md-block col-md-8">
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'О компании' )" 
					:to="{path: '/contacts'}" 
					class="nav-link"
					>
					О компании
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Авторы' )" 
					:to="{path: '/authors'}" 
					class="nav-link"
					>
					Авторы
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Политика конфиденциальности' )" 
					:to="{path: '/privacy-policy'}" 
					class="nav-link"
					>
					Политика конфиденциальности
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Отказ от ответственности' )" 
					:to="{path: '/disclaimer'}" 
					class="nav-link"
					>
					Отказ от ответственности
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Пользовательское соглашение' )" 
					:to="{path: '/terms'}" 
					class="nav-link"
					>
					Пользовательское соглашение
				</nuxt-link>
			</div>

			<div class="social col-12 col-md-2">
				<a @click.native="onSocialClick('vk')" href="https://vk.com/cryptoff" class="social_link vk" alt="vk" target="_blank"></a>
				<a @click.native="onSocialClick('tg')" href="https://telegram.im/@FF_RUS?lang=ru" class="social_link tg" alt="tg" target="_blank"></a>
				<a @click.native="onSocialClick('twitter')" href="https://twitter.com/www_FF_ru" class="social_link tr" alt="twitter" target="_blank"></a>
				<a @click.native="onSocialClick('fb')" href="https://fb.com/crypto.ff.ru/" class="social_link fb" alt="fb" target="_blank"></a>
			</div>
		</footer>

	</div>

</template>

<script>
  import { analMixin } from '~/components/mixins/analitics.js'

  export default {
  	mixins: [ analMixin  ],

	methods: {
	    onSocialClick: function ( network ) {
	      this.sendEvent( 'SocialFooter', 'click', network );
	    },
	}
  }
</script>
