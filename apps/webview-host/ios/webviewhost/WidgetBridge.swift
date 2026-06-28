import Foundation
import WidgetKit

@objc(WidgetBridge)
class WidgetBridge: NSObject {
  // 웹(홈)이 보낸 D-day/다음 일정 JSON을 App Group에 저장하고 위젯을 리로드한다.
  @objc func update(_ json: String) {
    let defaults = UserDefaults(suiteName: "group.com.woobottle.couplecalendar")
    defaults?.set(json, forKey: "widgetData")
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool { false }
}
