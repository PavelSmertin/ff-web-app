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
					<a href="https://welcome.ff.ru/?utm_source=ff&utm_medium=topmenu"
						class="nav-link"
						alt="о проекте"
						>
						О проекте
					</a>

					<a href="https://telegram.im/@FF_RUS?lang=ru" class="tg_banner_2" rel="nofollow noopener" target="_blank">
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
					class="ff_account_menu ff_account_menu_mob">
					Вход/Регистрация
				</nuxt-link>
				<nuxt-link
						@click.native="sendEvent( 'Toolbar', 'click', 'auth' )"
						v-if="$auth.loggedIn === false" :to="{ name: 'account-signin' }"
						class="ff_account_menu ff_account_menu_short">
					Вход
				</nuxt-link>
			</div>
		</header>

    	<nuxt/>

		<footer class="ff_footer" >
			<div class="ff_copyright ff-label"><span>Copyright &copy; FF.ru</span></div>

			<div class="ff_license">
				<a href="https://welcome.ff.ru/?utm_source=ff&utm_medium=btmmenu"
					class="nav-link"
					alt="о проекте"
					>
					О проекте
				</a>
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

			<div class="ff_social social">
				<a @click.native="onSocialClick('vk')" rel="nofollow noopener" href="https://vk.com/cryptoff" class="social_link vk" alt="vk" target="_blank"></a>
				<a @click.native="onSocialClick('tg')" rel="nofollow noopener" href="https://telegram.im/@FF_RUS?lang=ru" class="social_link tg" alt="tg" target="_blank"></a>
				<a @click.native="onSocialClick('twitter')" rel="nofollow noopener" href="https://twitter.com/www_FF_ru" class="social_link tr" alt="twitter" target="_blank"></a>
				<a @click.native="onSocialClick('fb')" rel="nofollow noopener" href="https://fb.com/crypto.ff.ru/" class="social_link fb" alt="fb" target="_blank"></a>
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
