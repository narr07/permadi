<script setup lang="ts">
	const { data } = await useAsyncData('navigation', () => {
		return queryCollectionNavigation('pages')
	})
</script>

<template>
	<NuxtRouteAnnouncer />
	<header class="app-header">
		<nav v-if="data">
			<ul class="nav-list">
				<li
					v-for="item in data"
					:key="item.path"
				>
					<NuxtLink
						:to="item.path"
					>
						{{ item.title }}
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</header>
	<NuxtPage />
</template>

<style scoped>
	.app-header {
		max-width: 800px;
		margin: 1rem auto 0;
		padding: 0 1rem;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-list a {
		text-decoration: none;
		color: inherit;
		font-weight: 500;
	}

	.nav-list a:hover,
	.nav-list a.router-link-active {
		text-decoration: underline;
	}
</style>