<template> 
	<article class="ff_post">
		<div class="description">

			<h1 class="margin60">Где хранить биткоины?</h1>

			<p>
			При использовании любого типа кошелька вы фактически не храните сам биткоин. Потому, что <nuxt-link :to="{path: '/wiki/6'}">биткоин</nuxt-link> - не является объектом, это закодированный адрес в blockchain. Кошелек является уникальным ключом доступа, который разблокирует конкретное местоположение биткоина, и именно это нужно защищать, сохраняя его в кошельке.
			Есть несколько вариантов хранения вашего биткоина в зависимости от безопасности и того насколько регулярно вы планируете его использовать.
			</p>

			<h2>Где хранить биткоины?</h2>

			<p>
			Хранить биткоины возможно несколькими способами:
			</p>

			<p>
			1. Биржа - если вы собиретесь торговать биткоином, то биржа будет удобным способом их хранения, но не забывайте, что биржи подвержены хакерским атакам и рекомендуется распределить свой криптовалютный портфель между несколькими биржами, чтобы снизить риск потерять все.
			</p>

			<p>
			2. Обменник - место где встречаются покупатель и продавец, чтобы <nuxt-link :to="{path: '/wiki/1'}">купить биткоин</nuxt-link> или продать его. Также считается ненадежным местом хранения, поскольку все обменники централизованы и также подвержены атакам хакеров, но в данном случае вам не придется платить комиссию за вывод средств.
			</p>

			<p>
			3. Самый надежный метод хранения биткоина - кошелек. Существует множество видов кошельков, но об этом ниже.
			</p>

			<h2>Как выбрать Bitcoin кошелек?</h2>

			<p>
			На сегодняшний день самыми надежными являются аппаратные кошельки. Большая часть аппаратных кошельков выглядят как USB-накопители и вставляются в USB разъем компьютера. Вы создаете PIN-код для последующего доступа к своим биткоинам, и сохраняете так называемым SEED, если вы забыли PIN-код, вы вводите SEED и восстанавливаете доступ к кошельку,. Дополнительным преимуществом аппаратного кошелька является полная анонимность, с которой вы можете совершать транзакции. Аппаратные кошельки устойчивы к вредоносным программам, и если вы потеряете кошелек, вы сможете восстановить средства приобретя новый аппаратный кошелек и восстановив на нем данные по утерянному с помощью SEED. Поэтому мы рекомендуем вам приобрести сразу 2 кошелька. Один для доступа второй для восстановления в случае утери первого.
			</p>

			<img class="margin6" src="https://preview.ibb.co/dT8qPo/image.png" alt="image" border="0">

			<p class="margin24">
			Существует множество надежных аппаратных кошельков стоимостью менее 100$. Рекомендуем Trezor или Ledger Nano S. Их необходимо заказывать только на официальных сайтах, не покупайте бу устройства.
			</p>

			<p>
			Также безопасным для хранения Bitcoin но менее удобным считается бумажный кошелек.
			Для его использования требуется немного более глубокое понимание того, как работают криптовалюты. Создайте бумажный кошелек онлайн с помощью любой специальной программы, например: WalletGenerator.net. Для этого не надо быть программистом, программа сгенерирует последовательность символов и отобразит 2 QR кода с личным и публичным ключами. Вам необходимо будет распечатать эти ключи на принтере для последующего доступа к кошельку.
			</p>

			<img class="margin6" src="https://preview.ibb.co/iMUQ78/image.png" alt="image" border="0">

			<p class="margin24">
			Большинство пользователей выбирают программный или мобильный кошелек для биткоина
			</p>

			<p>
			Установка кошелька непосредственно на вашем компьютере или телефоне дает вам безопасность, которую вы контролируете своими ключами. Большинство из них имеют относительно легкую конфигурацию. Недостатком является то, что они требуют большего обслуживания в виде резервных копий. Если ваш компьютер или телефон украден или поврежден, а ваши личные ключи не хранятся в другом месте, вы потеряете биткоины.
			</p>

			<p>
			Они также требуют больших мер предосторожности. Если ваш компьютер или телефон взломаны, и вор получит доступ к кошельку или личным ключам, он также получит ваши биткоин.
			</p>

			<p>
			Оригинальным программным кошельком является протокол Bitcoin Core, который запускает сеть Bitcoin. Вы можете его загрузить (это не значит, что вы должны стать полностью работоспособным узлом), но вам также нужно будет загрузить книгу всех транзакций с самого начала времен биткоина (2009). Как вы можете догадаться, это занимает много памяти - на момент написания более 145 ГБ.
			</p>

			<img class="margin6" src="https://preview.ibb.co/g7BDS8/BitPay.png" alt="BitPay" border="0">

			<p class="margin24">
			Большинство кошельков, используемых сегодня, являются «легкими» или SPV (упрощенная оплата), которые не загружают всю книгу, а синхронизируются с реальной. Electrum - это хорошо известный настольный биткойн-кошелек SPV, который также предлагает «холодное хранение» (полностью автономный вариант для дополнительной безопасности). Exodus может отслеживать несколько активов с помощью сложного пользовательского интерфейса. Некоторые (например, Jaxx ) считаются мультивалютными кошельками и вы можете хранить на них большое количество разных криптовалют, а некоторые (например, BitPay) предлагают возможность использования общих учетных записей.
			</p>
		</div>
		
	</article>
</template>

<script>
  export default {
    head() {
		return {
		title: 'Где хранить биткоины? Как выбрать биткоин кошелек - FF.ru',
		meta: [
		{ 
			hid: 'description', 
			name: 'description', 
			content: 'Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше.',
		},
		{ hid: 'og:type', property: 'og:type', content: 'website' },
		{ hid: 'og:url', property: 'og:url', content: process.env.baseUrl },
		{ hid: 'og:image', property: 'og:image', content: process.env.baseUrl + '/FF_cover968_b.png' },
		{ hid: 'twitter:image', name: 'twitter:image', content: process.env.baseUrl + '/FF_cover968_b.png' },

		{ hid: 'og:title', property: 'og:title', content: 'Где хранить биткоины? Как выбрать биткоин кошелек - FF.ru' },
		{ hid: 'og:description', property: 'og:description', content: 'Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше.' },
		{ hid: 'twitter:title', name: 'twitter:title', content: 'Где хранить биткоины? Как выбрать биткоин кошелек - FF.ru' },
		{ hid: 'twitter:description', name: 'twitter:description', content: 'Важно выбрать наиболее надежный и удобный способ хранения биткоина, для этого подойдут Bitcoin кошельки. Существует несколько типов кошельков, разберемся какой лучше.' },
		],
		}
	},

    mounted () {
      this.goto()
    },

    methods: {
      goto() {
        var element = this.$parent.$refs["scroll-container"]
        element.scrollTo(0, 0)
      },
    }
  }

</script>