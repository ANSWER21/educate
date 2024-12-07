// 结果对象
export interface Essay {
    rawEssay: string;
    sentNum: number;
    uniqueKey: string;
    essayAdvice: string;
    totalScore: number;
    totalEvaluation: string;
    essayLangName: string;
    majorScore: MajorScore;
    paraNum: number;
    essayFeedback: EssayFeedback;
    wordNum: number;
    fullScore: number;
    stLevel: string;
    stLevelCode: number;
    title: string;
    writeModel: number;
    writeType: number;
    piGaiReqTextType: number; // 新增字段
    allFeatureScore: AllFeatureScore; // 新增字段
}

// 所有特征分数对象
export interface AllFeatureScore {
    neuralScore: number;
    conjunction: number;
    grammar: number;
    spelling: number;
    advanceVocab: number;
    wordNum: number;
    topic: number;
    lexicalSubs: number;
    wordDiversity: number;
    sentComplex: number;
    structure: number;
}

// 评分对象
export interface MajorScore {
    grammarScore: number;
    grammarAdvice: string;
    topicScore: number;
    wordScore: number; // 修改为 number
    wordAdvice: string;
    structureScore: number;
    structureAdvice: string;
}

// 批改反馈对象
export interface EssayFeedback {
    sentsFeedback: SentenceFeedback[];
}

// 句子反馈对象
export interface SentenceFeedback {
    rawSent: string;
    paraId: number;
    sentId: number;
    errorPosInfos: ErrorPosInfo[];
    synInfo?: SynonymInfo[]; // 可选属性
    sentFeedback: string;
    sentStartPos: number;
    correctedSent: string;
    isContainGrammarError: boolean;
    isContainTypoError: boolean;
    isValidLangSent: boolean;
}

// 错误位置信息
export interface ErrorPosInfo {
    id: number;
    isValidLangChunk: boolean;
    orgChunk: string;
    errorTypeTitle: string;
    startPos: number;
    correctChunk: string;
    endPos: number;
    cardSubtitle: string;
    errBaseInfo: string;
    errToBBasicType: string;
    detailReason: string;
    knowledgeExp: string;
    exampleCases: ExampleCase[];
}

// 例句
export interface ExampleCase {
    right: string;
    rightTranslate: string;
    error: string;
}

// 同义词信息
export interface SynonymInfo {
    id: number;
    sourcePos: string;
    synType: string;
    sourceTran: string;
    tagList: string[];
    synId: number;
    source: SourceWord[];
    target: TargetWord[][];
}

// 源词信息
export interface SourceWord {
    startPos: number;
    endPos: number;
    word: string;
    stuLevel: number[];
}

// 目标词信息
export interface TargetWord {
    startPos: number;
    endPos: number;
    word: string;
    tran: string;
    stuLevel: number[];
}
