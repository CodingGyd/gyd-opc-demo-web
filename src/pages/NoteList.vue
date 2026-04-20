<template>
  <div class="note-list">
    <header class="note-list__header">
      <h2 class="note-list__title">我的笔记</h2>
      <div class="note-list__actions">
        <button class="btn btn-primary" @click="showDialog()">新建笔记</button>
        <span class="note-list__user">{{ userStore.userInfo?.username || '用户' }}</span>
        <button class="btn btn-logout" @click="handleLogout">退出</button>
      </div>
    </header>

    <div v-if="loading" style="text-align:center;padding:40px;color:var(--color-text-secondary);">加载中...</div>

    <div v-else-if="notes.length === 0" style="text-align:center;padding:40px;color:var(--color-text-secondary);">
      还没有笔记，点击"新建笔记"开始记录
    </div>

    <div v-else class="note-grid">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-card__title">{{ note.title }}</div>
        <p class="note-card__content">{{ note.content }}</p>
        <span class="note-card__time">{{ note.createTime }}</span>
      </div>
    </div>

    <!-- Dialog -->
    <div v-if="dialogVisible" class="dialog-overlay" @click.self="dialogVisible = false">
      <div class="dialog">
        <h3>新建笔记</h3>
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" placeholder="笔记标题" />
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea v-model="form.content" rows="6" placeholder="写下你的想法..." />
        </div>
        <div class="dialog__footer">
          <button class="btn" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" :disabled="submitting" @click="handleSubmit">
            {{ submitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { noteApi } from '@/api/note'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const notes = ref<any[]>([])
const dialogVisible = ref(false)
const submitting = ref(false)
const form = reactive({ title: '', content: '' })

async function handleLogout() {
  await userStore.logout()
}

async function fetchNotes() {
  loading.value = true
  try {
    const res: any = await noteApi.list()
    notes.value = res.data || []
  } finally {
    loading.value = false
  }
}

function showDialog() {
  form.title = ''
  form.content = ''
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!form.title.trim()) return
  submitting.value = true
  try {
    await noteApi.create({ title: form.title, content: form.content })
    dialogVisible.value = false
    fetchNotes()
  } finally {
    submitting.value = false
  }
}

onMounted(fetchNotes)
</script>

<style scoped>
.note-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.note-list__title { margin: 0; }
.note-list__actions { display: flex; align-items: center; gap: 12px; }
.note-list__user { font-size: 14px; color: #666; }
.btn-logout { color: #f56c6c; border-color: #f56c6c; }
.btn-logout:hover { background: #fef0f0; }

.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.note-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.2s;
}
.note-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.note-card__title { font-weight: 600; font-size: 16px; margin-bottom: 8px; }
.note-card__content { color: #666; font-size: 14px; margin: 0 0 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.note-card__time { font-size: 12px; color: #999; }

.dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.dialog { background: #fff; border-radius: 12px; padding: 24px; width: 480px; max-width: 90vw; }
.dialog h3 { margin: 0 0 16px; }
.dialog__footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }

.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.form-group input, .form-group textarea { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
.form-group textarea { resize: vertical; }

.btn { padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; background: #fff; cursor: pointer; font-size: 14px; }
.btn:hover { background: #f5f5f5; }
.btn-primary { background: #409eff; color: #fff; border-color: #409eff; }
.btn-primary:hover { background: #337ecc; }
</style>
