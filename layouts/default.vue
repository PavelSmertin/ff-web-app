<template>
	<div class="ff_container_fluid">
		<header>
			<div class="ff_toolbar">
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
						class="nav_link"
						>
						Курс биткоина
					</nuxt-link>
					<nuxt-link
						@click.native="sendEvent( 'Toolbar', 'click', 'магазин крипты' )"
						:to="{path: '/coins'}"
						class="nav_link"
						>
						Магазин крипты
					</nuxt-link>
					<nuxt-link 
						@click.native="sendEvent( 'Toolbar', 'click', 'купить биткоин' )"
						:to="{path: '/wiki/1'}" 
						class="nav_link"
						>
						Купить биткоин
					</nuxt-link>
					<a href="https://welcome.ff.ru/?utm_source=ff&utm_medium=topmenu"
						class="nav_link"
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
			<div class="ff_copyright ff_label"><span>Copyright &copy; FF.ru</span></div>

			<div class="ff_license">
				<a href="https://welcome.ff.ru/?utm_source=ff&utm_medium=btmmenu"
					class="nav_link"
					alt="о проекте"
					>
					О проекте
				</a>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Реклама на сайте' )" 
					:to="{path: '/adv'}" 
					class="nav_link"
					>
					Реклама на сайте
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Авторы' )" 
					:to="{path: '/authors'}" 
					class="nav_link"
					>
					Авторы
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Политика конфиденциальности' )" 
					:to="{path: '/privacy-policy'}" 
					class="nav_link"
					>
					Политика конфиденциальности
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Отказ от ответственности' )" 
					:to="{path: '/disclaimer'}" 
					class="nav_link"
					>
					Отказ от ответственности
				</nuxt-link>
				<nuxt-link  
					@click.native="sendEvent( 'Footer', 'click', 'Пользовательское соглашение' )" 
					:to="{path: '/terms'}" 
					class="nav_link"
					>
					Пользовательское соглашение
				</nuxt-link>

				<a href="/rss-export" alt="rss feed" class="nav_link">
					<svg class="icon_rss" width="13" height="13" viewBox="0 0 402.041 402.04">
						<path d="M54.816,292.382c-15.229,0-28.169,5.331-38.831,15.988C5.33,319.026,0,331.969,0,347.197
							c0,15.232,5.325,28.172,15.985,38.828c10.662,10.657,23.606,15.988,38.831,15.988c15.227,0,28.168-5.331,38.828-15.988
							c10.656-10.656,15.986-23.596,15.986-38.828c0-15.229-5.33-28.171-15.986-38.827C82.987,297.713,70.046,292.382,54.816,292.382z"
							/>
						<path d="M181.01,221.002c-21.51-21.698-46.158-38.97-73.948-51.816c-27.79-12.85-56.914-20.511-87.366-22.985h-1.425
							c-4.949,0-9.042,1.619-12.275,4.854C1.997,154.477,0,158.953,0,164.472v38.543c0,4.757,1.569,8.85,4.708,12.279
							c3.14,3.429,7.089,5.332,11.848,5.708c43.586,4.189,80.845,21.752,111.773,52.678c30.93,30.926,48.49,68.187,52.677,111.771
							c0.382,4.764,2.284,8.712,5.712,11.847c3.427,3.148,7.517,4.72,12.275,4.72h38.545c5.517,0,9.989-1.995,13.415-5.996
							c3.621-3.812,5.236-8.381,4.863-13.709c-2.478-30.447-10.14-59.573-22.987-87.361C219.983,267.16,202.708,242.514,181.01,221.002z
							"/>
						<path d="M367.728,239.701c-20.365-45.585-48.345-86.078-83.936-121.482c-35.405-35.594-75.896-63.572-121.485-83.939
							C116.723,13.917,68.996,2.494,19.126,0.02h-0.855c-4.949,0-9.136,1.713-12.563,5.14C1.903,8.583,0,12.964,0,18.294v40.825
							c0,4.76,1.667,8.897,4.996,12.419c3.33,3.523,7.373,5.376,12.132,5.57c40.924,2.478,79.799,12.188,116.63,29.127
							c36.83,16.94,68.806,38.972,95.93,66.09c27.118,27.123,49.149,59.101,66.089,95.931c16.94,36.836,26.557,75.705,28.839,116.627
							c0.195,4.764,2.046,8.809,5.564,12.139c3.524,3.329,7.762,4.999,12.71,4.999h40.823c5.331,0,9.701-1.902,13.134-5.715
							c3.809-3.806,5.517-8.274,5.144-13.415C399.52,333.017,388.093,285.291,367.728,239.701z"/>
					</svg>
				</a>
			</div>

			<div class="ff_social social">
				<a @click.native="onSocialClick('vk')" rel="nofollow noopener" href="https://vk.com/cryptoff" class="social_link vk" alt="vkontakte" target="_blank"></a>
				<a @click.native="onSocialClick('tg')" rel="nofollow noopener" href="https://telegram.im/@FF_RUS?lang=ru" class="social_link tg" alt="telegram" target="_blank"></a>
				<a @click.native="onSocialClick('twitter')" rel="nofollow noopener" href="https://twitter.com/www_FF_ru" class="social_link tr" alt="twitter" target="_blank"></a>
				<a @click.native="onSocialClick('fb')" rel="nofollow noopener" href="https://fb.com/crypto.ff.ru/" class="social_link fb" alt="facebook" target="_blank"></a>
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
