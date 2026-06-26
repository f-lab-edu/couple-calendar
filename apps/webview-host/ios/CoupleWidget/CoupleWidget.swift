import WidgetKit
import SwiftUI

// 앱(웹→네이티브 브리지)이 App Group UserDefaults["widgetData"]에 써 둔 JSON을 읽는다.
private let appGroupId = "group.com.woobottle.couplecalendar"
private let widgetDataKey = "widgetData"

struct CoupleData {
  var couple: String
  var ddayLabel: String
  var ddaySub: String
  var nextEventTitle: String?
  var nextEventWhen: String?

  static let placeholder = CoupleData(
    couple: "지수 ♥ 민준", ddayLabel: "D+730", ddaySub: "500일 · 2026년 7월 22일",
    nextEventTitle: "벚꽃 데이트", nextEventWhen: "내일 19:00"
  )

  static func load() -> CoupleData {
    guard let defaults = UserDefaults(suiteName: appGroupId),
          let raw = defaults.string(forKey: widgetDataKey),
          let data = raw.data(using: .utf8),
          let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
    else { return .empty }
    return CoupleData(
      couple: json["couple"] as? String ?? "우리",
      ddayLabel: json["ddayLabel"] as? String ?? "",
      ddaySub: json["ddaySub"] as? String ?? "",
      nextEventTitle: json["nextEventTitle"] as? String,
      nextEventWhen: json["nextEventWhen"] as? String
    )
  }

  static let empty = CoupleData(
    couple: "커플 캘린더", ddayLabel: "연결해 주세요", ddaySub: "앱에서 로그인하면 표시돼요",
    nextEventTitle: nil, nextEventWhen: nil
  )
}

struct CoupleEntry: TimelineEntry {
  let date: Date
  let data: CoupleData
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> CoupleEntry { CoupleEntry(date: Date(), data: .placeholder) }
  func getSnapshot(in context: Context, completion: @escaping (CoupleEntry) -> Void) {
    completion(CoupleEntry(date: Date(), data: context.isPreview ? .placeholder : CoupleData.load()))
  }
  func getTimeline(in context: Context, completion: @escaping (Timeline<CoupleEntry>) -> Void) {
    let entry = CoupleEntry(date: Date(), data: CoupleData.load())
    // 다음 일정 상대시간(예: "내일") 갱신을 위해 1시간마다 리프레시. 데이터 변경 시엔 앱이 reload를 호출.
    let next = Calendar.current.date(byAdding: .hour, value: 1, to: Date()) ?? Date().addingTimeInterval(3600)
    completion(Timeline(entries: [entry], policy: .after(next)))
  }
}

private let bg = Color(red: 0.05, green: 0.05, blue: 0.055)
private let accent = Color(red: 0.949, green: 0.392, blue: 0.098) // #F26419
private let primaryText = Color.white
private let secondaryText = Color.white.opacity(0.6)

struct CoupleWidgetEntryView: View {
  var entry: CoupleEntry
  @Environment(\.widgetFamily) var family

  var body: some View {
    ZStack {
      bg
      switch family {
      case .systemMedium: mediumBody
      default: smallBody
      }
    }
  }

  private var ddayBlock: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(entry.data.couple)
        .font(.system(size: 13, weight: .semibold))
        .foregroundColor(secondaryText)
        .lineLimit(1)
      Text(entry.data.ddayLabel)
        .font(.system(size: 34, weight: .bold, design: .rounded))
        .foregroundColor(primaryText)
        .lineLimit(1)
        .minimumScaleFactor(0.6)
      if !entry.data.ddaySub.isEmpty {
        Text(entry.data.ddaySub)
          .font(.system(size: 11, weight: .medium))
          .foregroundColor(secondaryText)
          .lineLimit(1)
      }
    }
  }

  private var smallBody: some View {
    ddayBlock
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      .padding(16)
  }

  private var mediumBody: some View {
    HStack(spacing: 14) {
      ddayBlock
        .frame(maxWidth: .infinity, alignment: .topLeading)
      Rectangle().fill(Color.white.opacity(0.08)).frame(width: 1)
      VStack(alignment: .leading, spacing: 6) {
        Text("다음 일정")
          .font(.system(size: 11, weight: .semibold))
          .foregroundColor(accent)
        if let title = entry.data.nextEventTitle {
          Text(title)
            .font(.system(size: 15, weight: .bold))
            .foregroundColor(primaryText)
            .lineLimit(2)
          if let when = entry.data.nextEventWhen {
            Text(when)
              .font(.system(size: 12, weight: .medium))
              .foregroundColor(secondaryText)
              .lineLimit(1)
          }
        } else {
          Text("예정된 일정이 없어요")
            .font(.system(size: 13, weight: .medium))
            .foregroundColor(secondaryText)
            .lineLimit(2)
        }
        Spacer(minLength: 0)
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
    .padding(16)
  }
}

@main
struct CoupleWidget: Widget {
  let kind = "CoupleWidget"
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      CoupleWidgetEntryView(entry: entry)
    }
    .configurationDisplayName("커플 캘린더")
    .description("우리 D-day와 다음 일정을 홈에서 한눈에.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
