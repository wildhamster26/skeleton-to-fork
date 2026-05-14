package com.example.pinyinwidget.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.actionStartActivity
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.wrapContentHeight
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.example.pinyinwidget.config.ConfigActivity
import com.example.pinyinwidget.data.WordDataStore
import com.example.pinyinwidget.data.models.Word
import com.example.pinyinwidget.data.models.WordSet
import kotlinx.coroutines.flow.first

class PinyinWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        val wordSet = WordDataStore.wordSetFlow(context).first()
        provideContent {
            GlanceTheme {
                WidgetContent(wordSet)
            }
        }
    }

    @Composable
    private fun WidgetContent(wordSet: WordSet?) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(GlanceTheme.colors.widgetBackground)
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            // Settings button row
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    text = "⚙",
                    style = TextStyle(
                        color = GlanceTheme.colors.secondary,
                        fontSize = 14.sp
                    ),
                    modifier = GlanceModifier
                        .actionStartActivity<ConfigActivity>()
                        .padding(4.dp)
                )
            }

            if (wordSet == null || wordSet.words.isEmpty()) {
                EmptyState()
            } else {
                WordList(wordSet)
            }
        }
    }

    @Composable
    private fun EmptyState() {
        Text(
            text = "Tap ⚙ to load a word file",
            style = TextStyle(
                color = GlanceTheme.colors.onBackground,
                fontSize = 14.sp
            )
        )
    }

    @Composable
    private fun WordList(wordSet: WordSet) {
        wordSet.words.forEachIndexed { index, word ->
            WordItem(word, wordSet.languages)
            if (index < wordSet.words.lastIndex) {
                Spacer(modifier = GlanceModifier.height(10.dp))
            }
        }
    }

    @Composable
    private fun WordItem(word: Word, languages: List<String>) {
        Column(modifier = GlanceModifier.fillMaxWidth().wrapContentHeight()) {
            Text(
                text = word.pinyin,
                style = TextStyle(
                    color = GlanceTheme.colors.primary,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            )
            languages.forEach { lang ->
                word.translations[lang]?.let { translation ->
                    Text(
                        text = translation,
                        style = TextStyle(
                            color = GlanceTheme.colors.onBackground,
                            fontSize = 14.sp
                        )
                    )
                }
            }
        }
    }
}
