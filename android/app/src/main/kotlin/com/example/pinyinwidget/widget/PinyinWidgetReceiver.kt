package com.example.pinyinwidget.widget

import androidx.glance.appwidget.GlanceAppWidgetReceiver

class PinyinWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget = PinyinWidget()
}
