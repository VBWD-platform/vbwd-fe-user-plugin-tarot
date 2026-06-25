<template>
  <div
    class="tarot-container"
    data-testid="tarot-dashboard"
  >
    <!-- Page Header -->
    <div class="tarot-header">
      <h1>{{ $t('tarot.title') }}</h1>
      <p class="subtitle">
        {{ $t('tarot.subtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="tarotStore.loading && !tarotStore.currentSession"
      class="loading-state"
    >
      <div class="spinner" />
      <p>{{ $t('common.loading') }}</p>
    </div>

    <!-- Error State -->
    <TarotErrorState
      v-else-if="tarotStore.error"
      :error="tarotStore.error"
      @retry="retryOperation"
    />

    <!-- Main Content -->
    <div
      v-else
      class="tarot-content"
    >
      <!-- Daily Limits Card -->
      <DailyLimitsCard
        :limits="tarotStore.dailyLimits"
        :loading="tarotStore.limitsLoading"
        @refresh="refreshLimits"
      />

      <!-- Session Expiry Warning -->
      <SessionExpiryWarning :minutes-remaining="tarotStore.sessionTimeRemaining" />

      <!-- Active Session -->
      <div
        v-if="tarotStore.hasActiveSession"
        class="session-card card"
      >
        <div class="card-header">
          <h2>{{ $t('tarot.currentSession') }}</h2>
          <span class="badge badge-active">{{ $t('tarot.active') }}</span>
        </div>

        <div class="session-content">
          <!-- Cards Grid -->
          <CardsGrid
            :cards="tarotStore.currentSession?.cards"
            :opened-card-ids="tarotStore.openedCards"
            @card-click="tarotStore.openCard"
            @card-fullscreen="showCardFullscreen"
          />

          <!-- Session Metrics -->
          <SessionMetrics
            :follow-ups-used="tarotStore.currentSession?.follow_up_count || 0"
            :max-follow-ups="tarotStore.currentSession?.max_follow_ups || 3"
            :tokens-used="tarotStore.currentSession?.tokens_consumed || 0"
            :time-remaining="tarotStore.sessionTimeRemaining"
          />

          <!-- Oracle Dialog -->
          <OracleDialog
            v-if="tarotStore.openedCards.size > 0"
            :phase="tarotStore.oraclePhase"
            :messages="tarotStore.conversationMessages"
            :situation-text="situationText"
            :follow-up-question="followUpQuestion"
            :loading="tarotStore.loading"
            @explain-cards="askCardExplanation"
            @discuss-situation="tarotStore.setOraclePhase('asking_situation')"
            @update-situation="situationText = $event"
            @submit-situation="submitSituation"
            @update-question="followUpQuestion = $event"
            @submit-question="submitFollowUpQuestion"
          />

          <!-- Close Session Button -->
          <button
            class="btn btn-secondary"
            data-testid="close-session-btn"
            @click="closeCurrentSession"
          >
            {{ $t('tarot.closeSession') }}
          </button>
        </div>
      </div>

      <!-- Empty Session - Create New -->
      <EmptySessionCard
        v-else
        :loading="tarotStore.loading"
        :can-create="tarotStore.canCreateSession"
        @create-session="createNewSession"
      />
    </div>

    <!-- Selected Card Detail Modal -->
    <CardDetailModal
      v-if="selectedCardId"
      :card-id="selectedCardId"
      :fullscreen="selectedCardFullscreen"
      @close="closeCardModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTarotStore } from '@/stores';
import DailyLimitsCard from './components/DailyLimitsCard.vue';
import SessionExpiryWarning from './components/SessionExpiryWarning.vue';
import CardsGrid from './components/CardsGrid.vue';
import SessionMetrics from './components/SessionMetrics.vue';
import OracleDialog from './components/OracleDialog.vue';
import EmptySessionCard from './components/EmptySessionCard.vue';
import CardDetailModal from './components/CardDetailModal.vue';
import TarotErrorState from './components/TarotErrorState.vue';

const tarotStore = useTarotStore();
const selectedCardId = ref<string | null>(null);
const selectedCardFullscreen = ref(false);
const situationText = ref('');
const followUpQuestion = ref('');

onMounted(async () => {
  if (!tarotStore.dailyLimits) {
    await tarotStore.initialize();
  }
});

const createNewSession = async () => {
  try {
    await tarotStore.createSession();
    await tarotStore.fetchDailyLimits();
  } catch (error) {
    console.error('Failed to create session:', error);
  }
};

const closeCurrentSession = () => {
  tarotStore.closeSession();
};

const refreshLimits = async () => {
  try {
    await tarotStore.fetchDailyLimits();
  } catch (error) {
    console.error('Failed to refresh limits:', error);
  }
};

const retryOperation = async () => {
  tarotStore.error = null;
  await tarotStore.initialize();
};

const submitSituation = async () => {
  try {
    await tarotStore.submitSituation(situationText.value);
    situationText.value = '';
  } catch (error) {
    console.error('Failed to submit situation:', error);
  }
};

const submitFollowUpQuestion = async () => {
  if (!followUpQuestion.value.trim()) {
    return;
  }

  try {
    await tarotStore.askFollowUpQuestion(followUpQuestion.value);
    followUpQuestion.value = '';
  } catch (error) {
    console.error('Failed to submit follow-up question:', error);
  }
};

const askCardExplanation = async () => {
  try {
    await tarotStore.askCardExplanation();
  } catch (error) {
    console.error('Failed to get card explanation:', error);
  }
};

const showCardFullscreen = (cardId: string) => {
  selectedCardId.value = cardId;
  selectedCardFullscreen.value = true;
};

const closeCardModal = () => {
  selectedCardId.value = null;
  selectedCardFullscreen.value = false;
};
</script>

<style scoped>
.tarot-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.tarot-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.tarot-header h1 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.subtitle {
  margin: 0;
  font-size: 1.05rem;
  color: var(--color-text-secondary);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.tarot-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.session-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.card {
  background: var(--color-background-secondary);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
}

.card-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-active {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.session-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary {
  background-color: var(--color-background);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

@media (max-width: 768px) {
  .tarot-container {
    padding: var(--spacing-md);
  }

  .tarot-header h1 {
    font-size: 1.8rem;
  }

  .card {
    padding: var(--spacing-md);
  }
}
</style>
