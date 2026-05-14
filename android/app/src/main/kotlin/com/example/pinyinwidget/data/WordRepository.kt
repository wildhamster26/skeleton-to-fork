package com.example.pinyinwidget.data

import android.content.Context
import android.net.Uri
import com.example.pinyinwidget.data.models.WordSet
import kotlinx.serialization.json.Json

class WordRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }

    fun loadFromUri(uri: Uri): Result<WordSet> = runCatching {
        val text = context.contentResolver.openInputStream(uri)
            ?.bufferedReader()
            ?.use { it.readText() }
            ?: error("Cannot open file")
        json.decodeFromString<WordSet>(text)
    }
}
