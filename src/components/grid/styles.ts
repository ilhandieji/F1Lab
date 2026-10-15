export const gridStyles = {
  page: "[--grid-scarlet:#ef1c25] relative isolate min-h-screen overflow-hidden bg-[#0b0b0d] [background-image:radial-gradient(ellipse_at_85%_2%,rgb(124_12_20_/_24%),transparent_34rem)] font-[Arial,Helvetica,sans-serif] text-[#f5f5f5]",
  ambient:
    "pointer-events-none absolute -right-32 top-0 -z-10 size-[38rem] rounded-full border border-[rgb(239_28_37_/_10%)] shadow-[0_0_0_3.5rem_rgb(239_28_37_/_2%),0_0_0_7rem_rgb(239_28_37_/_2%)]",
  content:
    "mx-auto w-[min(calc(100%_-_3rem),66rem)] py-20 pb-12 max-[540px]:w-[min(calc(100%_-_1.5rem),66rem)] max-[540px]:pt-12",
  header: "mb-[1.1rem]",
  eyebrow:
    "flex items-center gap-[0.65rem] text-[0.66rem] font-extrabold tracking-[0.16em] text-[#c4c4c8]",
  liveDot:
    "size-2 rounded-full bg-[var(--grid-scarlet)] shadow-[0_0_0.75rem_rgb(239_28_37_/_75%)]",
  title:
    "mt-4 text-[clamp(2.6rem,7vw,5.1rem)] font-black leading-[0.98] tracking-[-0.075em] uppercase",
  titleAccent: "text-[var(--grid-scarlet)]",
  subtitle: "mt-[1.1rem] text-[1.1rem] text-[#dbdfd1]",
  headerRule: "mt-[2.3rem] h-px bg-[#313135]",
  headerRuleAccent: "block h-0.5 w-20 bg-[var(--grid-scarlet)]",
  tableHeading:
    "grid grid-cols-[5.3rem_1fr_auto] px-[1.4rem] pt-[1.1rem] pb-[0.7rem] text-[0.66rem] font-extrabold tracking-[0.16em] text-[#77777d] max-[540px]:grid-cols-[3.8rem_1fr_auto] max-[540px]:px-[0.9rem]",
  tableHeadingLast: "text-right",
  standings: "grid gap-[0.55rem]",
  driverCard:
    "relative grid min-h-[7.5rem] grid-cols-[5.3rem_minmax(0,1fr)_auto] items-center overflow-hidden rounded-[0.35rem] border border-[#29292d] bg-[#141416] [background-image:linear-gradient(105deg,#1c1c1f,#141416_75%)] transition-[border-color,transform,background-color] duration-[160ms] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[var(--grid-scarlet)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-[160ms] hover:translate-x-[3px] hover:border-[#555055] hover:bg-[#202023] hover:before:opacity-100 motion-reduce:transition-none motion-reduce:before:transition-none max-[540px]:min-h-28 max-[540px]:grid-cols-[3.8rem_minmax(0,1fr)_auto]",
  position:
    "flex items-center justify-center gap-1 flex-col self-stretch border-r border-[#29292d] px-[0.2rem] py-[0.55rem] max-[540px]:gap-[0.2rem] max-[540px]:px-[0.1rem] max-[540px]:py-[0.45rem]",
  positionLabel:
    "text-[0.55rem] font-extrabold tracking-[0.16em] text-[#737379]",
  positionNumber:
    "mt-[0.1rem] text-[1.8rem] font-extrabold leading-none tracking-[-0.08em] text-[#f1f1f2] max-[540px]:text-[1.65rem]",
  driverInfo:
    "grid min-w-0 px-[1.35rem] py-4 max-[540px]:p-[0.85rem]",
  driverIdentity:
    "flex min-w-0 items-center gap-[0.85rem] max-[540px]:gap-[0.55rem]",
  teamLogos: "flex flex-[0_0_auto] items-center gap-[0.3rem] max-[540px]:gap-[0.2rem]",
  teamLogo:
    "flex h-10 w-[3.2rem] flex-[0_0_3.2rem] items-center justify-center max-[540px]:h-[2.2rem] max-[540px]:w-[2.45rem] max-[540px]:basis-[2.45rem]",
  teamLogoImage: "block size-full object-contain",
  teamLogoLight: "brightness-0 invert",
  teamLogoMissing:
    "block h-[65%] w-3/4 rounded-[0.2rem] border border-dashed border-[#55555b]",
  driverDetails: "min-w-0",
  driverFirstName:
    "block overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold tracking-[0.08em] text-[#aaaab0] uppercase",
  driverLastName:
    "mt-[0.1rem] overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(1.05rem,3vw,1.45rem)] font-[850] tracking-[-0.045em] uppercase",
  progressTrack:
    "col-span-full mt-[0.85rem] h-0.5 overflow-hidden bg-[#343438]",
  progressValue:
    "block h-full [background-image:linear-gradient(90deg,#b30f18,var(--grid-scarlet))]",
  score:
    "flex items-baseline gap-2 px-6 max-[540px]:gap-[0.3rem] max-[540px]:py-0 max-[540px]:pr-[0.85rem] max-[540px]:pl-[0.35rem]",
  scoreValue:
    "min-w-[2.7ch] text-right text-[clamp(1.4rem,4vw,2rem)] font-extrabold tracking-[-0.06em] text-white tabular-nums",
  scoreValueWide: "min-w-[3.5ch]",
  scoreLabel:
    "text-[0.58rem] font-extrabold tracking-[0.16em] text-[var(--grid-scarlet)]",
  footer:
    "mt-[1.1rem] flex justify-between gap-4 px-[0.2rem] py-[0.9rem] text-[0.58rem] font-extrabold tracking-[0.16em] text-[#77777d] max-[540px]:text-[0.5rem] max-[540px]:tracking-[0.1em]",
  loading:
    "grid min-h-screen place-items-center bg-[#0b0b0d] font-[Arial,Helvetica,sans-serif] text-[#f5f5f5]",
  tabs:
    "my-[1.5rem] mb-[1.1rem] flex gap-[1.4rem] overflow-x-auto overflow-y-hidden border-b border-[#313135] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[540px]:gap-4",
  tab:
    "relative min-h-[2.8rem] flex-[0_0_auto] border-0 bg-transparent px-[0.1rem] pt-2 pb-3 text-[0.78rem] font-[inherit] font-extrabold text-[#88888e] uppercase whitespace-nowrap transition-colors duration-[160ms] after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[var(--grid-scarlet)] after:content-[''] after:transition-transform after:duration-[180ms] aria-selected:text-[#f5f5f5] aria-selected:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--grid-scarlet)] motion-reduce:transition-none motion-reduce:after:transition-none max-[540px]:text-[0.67rem]",
  panel:
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--grid-scarlet)]",
  constructorHeading:
    "grid grid-cols-[5.3rem_minmax(0,1fr)_auto] px-[1.4rem] pt-[1.1rem] pb-[0.7rem] text-[0.66rem] font-extrabold tracking-[0.16em] text-[#77777d] max-[540px]:grid-cols-[3.8rem_minmax(0,1fr)_auto] max-[540px]:px-[0.9rem]",
  constructorList: "m-0 grid list-none gap-[0.55rem] p-0",
  constructorRow:
    "relative grid min-h-[5.6rem] grid-cols-[5.3rem_minmax(0,1fr)_auto] items-center overflow-hidden rounded-[0.35rem] border border-[#29292d] bg-[#141416] [background-image:linear-gradient(105deg,#1c1c1f,#141416_75%)] transition-[border-color,transform,background-color] duration-[160ms] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[var(--grid-scarlet)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-[160ms] hover:translate-x-[3px] hover:border-[#555055] hover:bg-[#202023] hover:before:opacity-100 motion-reduce:transition-none motion-reduce:before:transition-none max-[540px]:min-h-20 max-[540px]:grid-cols-[3.8rem_minmax(0,1fr)_auto]",
  constructorPosition:
    "flex flex-col items-center justify-center gap-1 self-stretch border-r border-[#29292d] px-[0.2rem] py-[0.55rem] max-[540px]:gap-[0.2rem] max-[540px]:px-[0.1rem] max-[540px]:py-[0.45rem]",
  constructorIdentity:
    "flex min-w-0 items-center gap-[0.85rem] px-[1.35rem] py-3 max-[540px]:gap-[0.55rem] max-[540px]:px-3 max-[540px]:py-[0.65rem]",
  constructorLogo:
    "flex h-10 w-[3.2rem] flex-[0_0_3.2rem] items-center justify-center max-[540px]:h-[2.2rem] max-[540px]:w-[2.45rem] max-[540px]:basis-[2.45rem]",
  constructorName:
    "m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(1rem,3vw,1.35rem)] font-[850] tracking-[-0.04em] text-[#f2f2f3] uppercase max-[540px]:text-[0.85rem]",
  constructorScore:
    "flex items-baseline gap-2 px-6 max-[540px]:gap-[0.3rem] max-[540px]:pr-[0.85rem] max-[540px]:pl-[0.35rem]",
  activityView: "px-0 pt-1 pb-4",
  activitySection: "mb-[2.2rem]",
  activitySectionHeading:
    "mb-[0.9rem] flex items-end justify-between gap-4 max-[540px]:items-start max-[540px]:flex-col max-[540px]:gap-[0.3rem]",
  activitySectionTitle:
    "mt-[0.2rem] mb-0 text-[1.25rem] font-[850] text-[#f2f2f3] uppercase",
  activitySectionDescription:
    "m-0 text-[0.78rem] text-[#99999f] max-[540px]:text-[0.7rem]",
  activityKicker:
    "text-[0.58rem] font-extrabold tracking-[0.14em] text-[var(--grid-scarlet)]",
  activityStats:
    "grid grid-cols-3 rounded-[0.35rem] border border-[#29292d] bg-[#141416] [background-image:linear-gradient(105deg,#1c1c1f,#141416_75%)]",
  activityStat:
    "grid min-w-0 gap-[0.35rem] p-4 max-[540px]:px-[0.65rem] max-[540px]:py-3",
  activityStatDivider: "border-l border-[#29292d]",
  activityStatLabel:
    "text-[0.58rem] font-extrabold tracking-[0.1em] text-[#99999f] max-[540px]:text-[0.48rem] max-[540px]:leading-[1.35]",
  activityStatValue:
    "text-[1.8rem] leading-none text-white tabular-nums max-[540px]:text-[1.5rem]",
  activityNote:
    "mt-[0.6rem] mb-0 text-[0.72rem] leading-[1.5] text-[#85858b]",
  activityTimeline:
    "m-0 grid list-none gap-[1.15rem] border-l border-[#38383d] py-0 pr-0 pb-0 pl-[1.1rem]",
  activityEvent: "relative min-w-0",
  activityRound:
    "absolute -left-[1.7rem] top-0 grid size-[1.2rem] place-items-center rounded-full border border-[#6e2025] bg-[#190e10] text-[0.45rem] font-extrabold text-[#ff666d]",
  activityEventHeading:
    "mb-[0.65rem] flex items-start justify-between gap-4 max-[540px]:flex-col max-[540px]:gap-[0.3rem]",
  activityEventTitle:
    "mt-[0.2rem] mb-0 text-[0.95rem] font-bold text-[#f2f2f3] max-[540px]:text-[0.82rem]",
  activityEventCount:
    "flex-[0_0_auto] pt-[0.1rem] text-[0.56rem] font-extrabold tracking-[0.08em] text-[#77777d]",
  activityChangeList:
    "grid grid-cols-2 gap-[0.55rem] max-[540px]:grid-cols-1",
  activityChange:
    "min-w-0 rounded-[0.3rem] border border-[#29292d] bg-[#131315] [background-image:linear-gradient(105deg,#1a1a1d,#131315_75%)] px-[0.9rem] py-[0.8rem]",
  activityTeamHeading: "flex min-w-0 items-center gap-[0.55rem]",
  activityTeamLogo:
    "grid h-6 w-8 flex-[0_0_2rem] place-items-center",
  activityTeamName:
    "m-0 flex-[1_1_auto] overflow-hidden text-ellipsis whitespace-nowrap text-[0.8rem] text-[#e8e8e9]",
  activityKind:
    "flex-[0_0_auto] text-[0.5rem] font-extrabold tracking-[0.07em] text-[#b7b7bd] max-[540px]:text-[0.45rem]",
  activityKindSubstitution: "text-[#ff626a]",
  activityKindTransfer: "text-[#f3c45b]",
  activityKindReturn: "text-[#9bd0bf]",
  activitySeatChange:
    "mt-[0.8rem] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[0.55rem]",
  activitySeat:
    "grid min-w-0 gap-[0.2rem]",
  activitySeatLabel:
    "text-[0.5rem] font-extrabold tracking-[0.1em] text-[#77777d]",
  activitySeatValue:
    "wrap-anywhere text-[0.78rem] font-bold text-[#f1f1f2]",
  activityArrow:
    "text-[0.55rem] font-extrabold text-[var(--grid-scarlet)]",
  activityStint:
    "mt-3 border-t border-[#29292d] pt-[0.55rem] text-[0.65rem] text-[#a7a7ad] tabular-nums",
  activityEmpty:
    "m-0 rounded-[0.3rem] border border-[#29292d] p-4 text-[0.8rem] text-[#a7a7ad]",
  activityList:
    "m-0 grid list-none grid-cols-2 gap-[0.45rem] p-0 max-[540px]:grid-cols-1",
  activityDriver:
    "flex min-w-0 items-center gap-[0.65rem] rounded-[0.3rem] border border-[#29292d] bg-[#151517] px-3 py-[0.6rem]",
  activityTestDriver:
    "flex min-w-0 flex-col items-start gap-[0.35rem] rounded-[0.3rem] border border-[#29292d] bg-[#151517] px-3 py-[0.6rem]",
  activityDriverLogos: "flex flex-[0_0_auto] gap-[0.1rem]",
  activityDriverLogo: "grid h-6 w-[1.8rem] place-items-center",
  activityDriverInfo:
    "grid min-w-0 flex-[1_1_auto] gap-[0.15rem]",
  activityDriverName:
    "overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] text-[#e9e9ea]",
  activityDriverDescription:
    "overflow-hidden text-ellipsis whitespace-nowrap text-[0.59rem] text-[#88888e]",
  activityWeekendCount:
    "flex-[0_0_auto] text-right text-[0.62rem] text-[#b5b5bb] tabular-nums",
  activityTestTeams:
    "flex flex-wrap gap-x-[0.65rem] gap-y-[0.3rem] text-[0.65rem] text-[#a1a1a7]",
  activityTestTeam: "inline-flex items-center gap-[0.3rem]",
  activityTestLogo: "inline-grid h-4 w-6 place-items-center",
  yearNavigation:
    "mb-4 flex items-center gap-3",
  yearButton:
    "grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[var(--grid-scarlet)] hover:bg-[var(--grid-scarlet)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--grid-scarlet)] disabled:cursor-not-allowed disabled:opacity-35",
  yearLabel:
    "min-w-[4ch] text-center text-[0.8rem] font-extrabold tracking-[0.14em] text-[#c4c4c8]",
} as const;
