<template>
	<div class="ff_container_fluid">
		<div class="error">
			<img class="love_img" src="~/assets/images/love.svg" alt="thnx">


			<div v-if="error.statusCode === 404">
				<div class="class404">404</div>
				<div class="title">Страница не найдена</div>
				<a href="/" class="button_link">Назад на главную</a>
			</div>

			<div v-if="error.statusCode === 504">
				<div class="class504">Ошибка сети</div>
				<div class="title">Проверьте интернет соединение</div>
			</div>

		</div>
	</div>

</template>

<script>
	export default {
		props: ['error'],
	}
</script>