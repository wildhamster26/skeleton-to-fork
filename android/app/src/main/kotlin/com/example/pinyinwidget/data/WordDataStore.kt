package com.example.pinyinwidget.data

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.example.pinyinwidget.data.models.WordSet
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

private val Context.dataStore by preferencesDataStore(name = "pinyin_widget_prefs")

object WordDataStore {

    private val WORD_SET_KEY = stringPreferencesKey("word_set_json")

    fun wordSetFlow(context: Context): Flow<WordSet?> =
        context.dataStore.data.map { prefs ->
            prefs[WORD_SET_KEY]?.let {
                runCatching { Json.decodeFromString<WordSet>(it) }.getOrNull()
            }
        }

    suspend fun saveWordSet(context: Context, wordSet: WordSet) {
        context.dataStore.edit { prefs ->
            prefs[WORD_SET_KEY] = Json.encodeToString(wordSet)
        }
    }
}
