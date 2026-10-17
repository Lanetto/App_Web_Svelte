<script lang="ts">
    import {enhance} from '$app/forms';
	import { updated } from '$app/state';

    let {data, form}= $props();
    let loading =$state(false);
</script>

<h1 class="text-2xl font-bold p-6">Amministrazione</h1>

<div class="mx-6 mb-6 p-4 border-gray-300 rounded-lg max-w-md">
    <h2 class="text-lg font-bold mb-2">Database carte</h2>

    {#if data.state?.lastSyncAt}
        <p class="text-sm text-gray-700">
            Ultima sincronizzazione: {data.state.lastSyncAt.toLocaleString('it-IT')}
        </p>
        <p class="text-sm text-gray-700">
            Carte nel database: {data.state.cardCount ?? '-'}
        </p>
    {:else}
        <p class="text-sm text-gray-700">
            Nessuna sincronizzazione registrata.
        </p>
    {/if}

    {#if data.state?.lastError}
        <p class="text-sm text-red-600">
            Ultimo errore: {data.state.lastError}
        </p>
    {/if}

    <form
        method="POST"
        action="?/sync"
        class="flex flex-col gap-2 mt-4"
        use:enhance={() => {
            loading= true;
            return async ({update}) => {
                await update({reset: false});
                loading = false;
            };
        }}
    >

    <input type="password" name="password" placeholder="Password admin" required />
    <button
        type="submit"
        disabled={loading}
        class="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
    >
        {loading ? 'Sincronizzazione in corso...' : 'Sincronizzazione ora'}
    </button>
    </form>

    {#if form?.message}
        <p class="mt-2 text-sm {form.success ? 'text-green-700' : 'text-red-600'}">
            {form.message}
        </p>        
    {/if}
</div>