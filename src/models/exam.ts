import {Select} from "@/models/select.ts";

export interface Exam {
    id: number | null,
    title: string,
    subject: string,
    date: Date,
    createId: number,
    files: string[],
}

export const getSubjectTip = (value: string): string => {
    const subject = findSubjectByValue(value)
    return `(${subject?.value})${subject?.label}`
}

export function findSubjectByValue(value: string): Select<string, string> | undefined {
    return SUBJECTS.find(subject => subject.value === value);
}

export const SUBJECTS: Select<string, string>[] = [
    {label: "政治", value: "101"},
    {label: "英语一", value: "201"},
    {label: "英语二", value: "204"},
    {label: "数学一", value: "301"},
    {label: "数学二", value: "302"},
    {label: "数学三", value: "303"},
    {label: "管理类联考综合能力", value: "199"},
    {label: "教育学专业基础综合", value: "311"},
    {label: "心理学专业基础综合", value: "312"},
    // {label: "应用伦理", value: "0151"},
    // {label: "金融", value: "0251"},
    // {label: "应用统计", value: "0252"},
    // {label: "税务", value: "0253"},
    // {label: "国际商务", value: "0254"},
    // {label: "保险", value: "0255"},
    // {label: "资产评估", value: "0256"},
    // {label: "数字经济", value: "0258"},
    // {label: "法律", value: "0351"},
    // {label: "社会工作", value: "0352"},
    // {label: "警务", value: "0353"},
    // {label: "知识产权", value: "0354"},
    // {label: "国际事务", value: "0355"},
    // {label: "教育", value: "0451"},
    // {label: "体育", value: "0452"},
    // {label: "国际中文教育", value: "0453"},
    // {label: "应用心理", value: "0454"},
    // {label: "翻译", value: "0551"},
    // {label: "新闻与传播", value: "0552"},
    // {label: "出版", value: "0553"},
    // {label: "博物馆", value: "0651"},
    // {label: "气象", value: "0751"},
    // {label: "建筑", value: "0851"},
    // {label: "城乡规划", value: "0853"},
    // {label: "电子信息", value: "0854"},
    // {label: "机械", value: "0855"},
    // {label: "材料与化工", value: "0856"},
    // {label: "资源与环境", value: "0857"},
    // {label: "能源动力", value: "0858"},
    // {label: "土木水利", value: "0859"},
    // {label: "生物与医药", value: "0860"},
    // {label: "交通运输", value: "0861"},
    // {label: "风景园林", value: "0862"},
    // {label: "农业", value: "0951"},
    // {label: "兽医", value: "0952"},
    // {label: "林业", value: "0954"},
    // {label: "食品与营养", value: "0955"},
    // {label: "临床医学", value: "1051"},
    // {label: "口腔医学", value: "1052"},
    // {label: "公共卫生", value: "1053"},
    // {label: "护理", value: "1054"},
    // {label: "药学", value: "1055"},
    // {label: "中药", value: "1056"},
    // {label: "中医", value: "1057"},
    // {label: "医学技术", value: "1058"},
    // {label: "针灸", value: "1059"},
    // {label: "联合作战指挥", value: "1152"},
    // {label: "军兵种作战指挥", value: "1153"},
    // {label: "作战指挥保障", value: "1154"},
    // {label: "战时政治工作", value: "1155"},
    // {label: "后勤与装备保障", value: "1156"},
    // {label: "军事训练与管理", value: "1157"},
    // {label: "工商管理", value: "1251"},
    // {label: "公共管理", value: "1252"},
    // {label: "会计", value: "1253"},
    // {label: "旅游管理", value: "1254"},
    // {label: "图书情报", value: "1255"},
    // {label: "工程管理", value: "1256"},
    // {label: "审计", value: "1257"},
    // {label: "音乐", value: "1352"},
    // {label: "舞蹈", value: "1353"},
    // {label: "戏剧与影视", value: "1354"},
    // {label: "戏曲与曲艺", value: "1355"},
    // {label: "美术与书法", value: "1356"},
    // {label: "设计", value: "1357"},
    // {label: "文物", value: "1451"},
    // {label: "密码", value: "1452"},
    // {label: "哲学", value: "0101"},
    // {label: "理论经济学", value: "0201"},
    // {label: "应用经济学", value: "0202"},
    // {label: "统计学", value: "0270"},
    // {label: "区域国别学", value: "0271"},
    // {label: "法学", value: "0301"},
    // {label: "政治学", value: "0302"},
    // {label: "社会学", value: "0303"},
    // {label: "民族学", value: "0304"},
    // {label: "马克思主义理论", value: "0305"},
    // {label: "公安学", value: "0306"},
    // {label: "中共党史党建学", value: "0307"},
    // {label: "纪检监察学", value: "0308"},
    // {label: "国家安全学", value: "0370"},
    // {label: "区域国别学", value: "0371"},
    // {label: "教育学", value: "0401"},
    // {label: "心理学", value: "0402"},
    // {label: "体育学", value: "0403"},
    // {label: "中国语言文学", value: "0501"},
    // {label: "外国语言文学", value: "0502"},
    // {label: "新闻传播学", value: "0503"},
    // {label: "区域国别学", value: "0570"},
    // {label: "考古学", value: "0601"},
    // {label: "中国史", value: "0602"},
    // {label: "世界史", value: "0603"},
    // {label: "区域国别学", value: "0670"},
    // {label: "数学", value: "0701"},
    // {label: "物理学", value: "0702"},
    // {label: "化学", value: "0703"},
    // {label: "天文学", value: "0704"},
    // {label: "地理学", value: "0705"},
    // {label: "大气科学", value: "0706"},
    // {label: "海洋科学", value: "0707"},
    // {label: "地球物理学", value: "0708"},
    // {label: "地质学", value: "0709"},
    // {label: "生物学", value: "0710"},
    // {label: "系统科学", value: "0711"},
    // {label: "科学技术史", value: "0712"},
    // {label: "生态学", value: "0713"},
    // {label: "统计学", value: "0714"},
    // {label: "集成电路科学与工程", value: "0770"},
    // {label: "心理学", value: "0771"},
    // {label: "力学", value: "0772"},
    // {label: "材料科学与工程", value: "0773"},
    // {label: "电子科学与技术", value: "0774"},
    // {label: "计算机科学与技术", value: "0775"},
    // {label: "环境科学与工程", value: "0776"},
    // {label: "生物医学工程", value: "0777"},
    // {label: "基础医学", value: "0778"},
    // {label: "公共卫生与预防医学", value: "0779"},
    // {label: "药学", value: "0780"},
    // {label: "中药学", value: "0781"},
    // {label: "护理学", value: "0783"},
    // {label: "遥感科学与技术", value: "0787"},
    // {label: "智能科学与技术", value: "0788"},
    // {label: "纳米科学与工程", value: "0789"},
    // {label: "力学", value: "0801"},
    // {label: "机械工程", value: "0802"},
    // {label: "光学工程", value: "0803"},
    // {label: "仪器科学与技术", value: "0804"},
    // {label: "材料科学与工程", value: "0805"},
    // {label: "冶金工程", value: "0806"},
    // {label: "动力工程及工程热物理", value: "0807"},
    // {label: "电气工程", value: "0808"},
    // {label: "电子科学与技术", value: "0809"},
    // {label: "信息与通信工程", value: "0810"},
    // {label: "控制科学与工程", value: "0811"},
    // {label: "计算机科学与技术", value: "0812"},
    // {label: "建筑学", value: "0813"},
    // {label: "土木工程", value: "0814"},
    // {label: "水利工程", value: "0815"},
    // {label: "测绘科学与技术", value: "0816"},
    // {label: "化学工程与技术", value: "0817"},
    // {label: "地质资源与地质工程", value: "0818"},
    // {label: "矿业工程", value: "0819"},
    // {label: "石油与天然气工程", value: "0820"},
    // {label: "纺织科学与工程", value: "0821"},
    // {label: "轻工技术与工程", value: "0822"},
    // {label: "交通运输工程", value: "0823"},
    // {label: "船舶与海洋工程", value: "0824"},
    // {label: "航空宇航科学与技术", value: "0825"},
    // {label: "兵器科学与技术", value: "0826"},
    // {label: "核科学与技术", value: "0827"},
    // {label: "农业工程", value: "0828"},
    // {label: "林业工程", value: "0829"},
    // {label: "环境科学与工程", value: "0830"},
    // {label: "生物医学工程", value: "0831"},
    // {label: "食品科学与工程", value: "0832"},
    // {label: "城乡规划学", value: "0833"},
    // {label: "软件工程", value: "0835"},
    // {label: "生物工程", value: "0836"},
    // {label: "安全科学与工程", value: "0837"},
    // {label: "公安技术", value: "0838"},
    // {label: "网络空间安全", value: "0839"},
    // {label: "科学技术史", value: "0870"},
    // {label: "管理科学与工程", value: "0871"},
    // {label: "设计学", value: "0872"},
    // {label: "集成电路科学与工程", value: "0873"},
    // {label: "国家安全学", value: "0874"},
    // {label: "遥感科学与技术", value: "0875"},
    // {label: "智能科学与技术", value: "0876"},
    // {label: "纳米科学与工程", value: "0877"},
    // {label: "作物学", value: "0901"},
    // {label: "园艺学", value: "0902"},
    // {label: "农业资源与环境", value: "0903"},
    // {label: "植物保护", value: "0904"},
    // {label: "畜牧学", value: "0905"},
    // {label: "兽医学", value: "0906"},
    // {label: "林学", value: "0907"},
    // {label: "水产", value: "0908"},
    // {label: "草学", value: "0909"},
    // {label: "水土保持与荒漠化防治学", value: "0910"},
    // {label: "科学技术史", value: "0970"},
    // {label: "环境科学与工程", value: "0971"},
    // {label: "食品科学与工程", value: "0972"},
    // {label: "基础医学", value: "1001"},
    // {label: "临床医学", value: "1002"},
    // {label: "口腔医学", value: "1003"},
    // {label: "公共卫生与预防医学", value: "1004"},
    // {label: "中医学", value: "1005"},
    // {label: "中西医结合", value: "1006"},
    // {label: "药学", value: "1007"},
    // {label: "中药学", value: "1008"},
    // {label: "特种医学", value: "1009"},
    // {label: "护理学", value: "1011"},
    // {label: "法医学", value: "1012"},
    // {label: "科学技术史", value: "1071"},
    // {label: "生物医学工程", value: "1072"},
    // {label: "军事思想与军事历史", value: "1101"},
    // {label: "战略学", value: "1102"},
    // {label: "联合作战学", value: "1103"},
    // {label: "军兵种作战学", value: "1104"},
    // {label: "军队指挥学", value: "1105"},
    // {label: "军队政治工作学", value: "1106"},
    // {label: "军事后勤学", value: "1107"},
    // {label: "军事装备学", value: "1108"},
    // {label: "军事管理学", value: "1109"},
    // {label: "军事训练学", value: "1110"},
    // {label: "军事智能", value: "1111"},
    // {label: "国家安全学", value: "1170"},
    // {label: "管理科学与工程", value: "1201"},
    // {label: "工商管理学", value: "1202"},
    // {label: "农林经济管理", value: "1203"},
    // {label: "公共管理学", value: "1204"},
    // {label: "信息资源管理", value: "1205"},
    // {label: "安全科学与工程", value: "1270"},
    // {label: "国家安全学", value: "1271"},
    // {label: "艺术学", value: "1301"},
    // {label: "设计学", value: "1370"},
    // {label: "集成电路科学与工程", value: "1401"},
    // {label: "国家安全学", value: "1402"},
    // {label: "设计学", value: "1403"},
    // {label: "遥感科学与技术", value: "1404"},
    // {label: "智能科学与技术", value: "1405"},
    // {label: "纳米科学与工程", value: "1406"},
    // {label: "区域国别学", value: "1407"},
]







