package com.example.pinyinwidget.config

import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.glance.appwidget.updateAll
import androidx.lifecycle.lifecycleScope
import com.example.pinyinwidget.R
import com.example.pinyinwidget.data.WordDataStore
import com.example.pinyinwidget.data.WordRepository
import com.example.pinyinwidget.widget.PinyinWidget
import kotlinx.coroutines.launch

class ConfigActivity : AppCompatActivity() {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private val repository by lazy { WordRepository(this) }
    private lateinit var statusText: TextView

    private val filePicker =
        registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
            if (uri == null) {
                // User dismissed the picker without selecting
                if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
                    setResult(RESULT_CANCELED)
                    finish()
                }
                return@registerForActivityResult
            }

            // Persist read permission so it survives reboots if we ever need to re-read
            contentResolver.takePersistableUriPermission(
                uri, Intent.FLAG_GRANT_READ_URI_PERMISSION
            )

            repository.loadFromUri(uri).fold(
                onSuccess = { wordSet ->
                    lifecycleScope.launch {
                        WordDataStore.saveWordSet(applicationContext, wordSet)
                        PinyinWidget().updateAll(applicationContext)
                        finishWithResult()
                    }
                },
                onFailure = { error ->
                    val msg = "Invalid file: ${error.message}"
                    Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
                    statusText.text = msg
                }
            )
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setResult(RESULT_CANCELED)

        appWidgetId = intent.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

        setContentView(R.layout.activity_config)
        statusText = findViewById(R.id.status_text)

        findViewById<Button>(R.id.btn_choose_file).setOnClickListener {
            filePicker.launch(arrayOf("application/json", "*/*"))
        }
    }

    private fun finishWithResult() {
        if (appWidgetId != AppWidgetManager.INVALID_APPWIDGET_ID) {
            val result = Intent().apply {
                putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
            }
            setResult(RESULT_OK, result)
        }
        finish()
    }
}
