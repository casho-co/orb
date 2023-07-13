package com.casho.app

import java.util.LinkedList

object EventQueue {
  private var eventQueue = LinkedList<Event>()

  fun currentEvent(): Event? {
    return this.eventQueue.peek()
  }

  fun add(event: Event) {
    this.eventQueue.add(event)
  }

  fun poll() {
    this.eventQueue.poll()
  }
}
