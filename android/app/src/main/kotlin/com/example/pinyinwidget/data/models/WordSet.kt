package com.example.pinyinwidget.data.models

import kotlinx.serialization.Serializable

@Serializable
data class WordSet(
    val languages: List<String>,
    val words: List<Word>
)

@Serializable
data class Word(
    val pinyin: String,
    val translations: Map<String, String>
)
