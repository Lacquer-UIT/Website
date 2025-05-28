"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Volume2 } from "lucide-react"
import type { EnglishWordResponse, VietnameseWordResponse } from "@/lib/types"
import type { Language } from "@/hooks/use-dictionary"

interface WordDisplayProps {
  wordData: EnglishWordResponse | VietnameseWordResponse
  language: Language
}

function isEnglishWord(wordData: any): wordData is EnglishWordResponse {
  return 'wordTypes' in wordData
}

function isVietnameseWord(wordData: any): wordData is VietnameseWordResponse {
  return 'meanings' in wordData
}

export function WordDisplay({ wordData, language }: WordDisplayProps) {
  console.log('WordDisplay received:', { wordData, language })
  console.log('WordData type check - isEnglish:', isEnglishWord(wordData), 'isVietnamese:', isVietnameseWord(wordData))
  
  if (isEnglishWord(wordData)) {
    return <EnglishWordDisplay wordData={wordData} />
  }

  if (isVietnameseWord(wordData)) {
    return <VietnameseWordDisplay wordData={wordData} />
  }

  console.error('WordDisplay: Unknown word data structure:', wordData)
  return <div>Error: Unknown word structure</div>
}

function EnglishWordDisplay({ wordData }: { wordData: EnglishWordResponse }) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
          <Badge variant="outline" className="text-sm">
            {wordData.difficulty}
          </Badge>
        </div>
        {wordData.pronunciation && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            <span className="text-lg">{wordData.pronunciation}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {wordData.wordTypes.map((wordType, index) => (
          <div key={wordType._id || index}>
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-3">
              <Badge variant="secondary" className="text-sm">
                {wordType.type}
              </Badge>
              <div className="space-y-2">
                {wordType.definitions.map((definition, defIndex) => (
                  <div key={defIndex} className="ml-4">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium">
                        {defIndex + 1}.
                      </span>
                      <span>{typeof definition === 'string' ? definition : JSON.stringify(definition)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {wordType.examples.length > 0 && (
                <div className="ml-4 mt-3">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    Examples:
                  </h4>
                  <div className="space-y-1">
                    {wordType.examples.map((example, exIndex) => (
                      <div key={exIndex} className="text-sm italic text-muted-foreground ml-2">
                        "...{example}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function VietnameseWordDisplay({ wordData }: { wordData: VietnameseWordResponse }) {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">{wordData.word}</CardTitle>
          <Badge variant="outline" className="text-sm">
            {wordData.difficulty_level}
          </Badge>
        </div>
        {wordData.pronunciations.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            <div className="flex gap-2">
              {wordData.pronunciations.map((pronunciation, index) => (
                <span key={index} className="text-lg">{pronunciation}</span>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {wordData.meanings.map((meaning, index) => (
          <div key={meaning._id || index}>
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-3">
              <Badge variant="secondary" className="text-sm">
                {meaning.part_of_speech.type}
              </Badge>
              <div className="space-y-4">
                {meaning.definitions.map((definition, defIndex) => (
                  <div key={definition._id || defIndex} className="ml-4">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium">
                        {defIndex + 1}.
                      </span>
                      <span>{typeof definition === 'object' && definition?.text ? definition.text : (typeof definition === 'string' ? definition : JSON.stringify(definition))}</span>
                    </div>
                    {definition.examples && definition.examples.length > 0 && (
                      <div className="ml-6 mt-3">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Examples:
                        </h4>
                        <div className="space-y-2">
                          {definition.examples.map((example, exIndex) => (
                            <div key={example._id || exIndex} className="text-sm space-y-1">
                              <div className="italic text-muted-foreground">
                                "{example.phrase}"
                              </div>
                              <div className="text-muted-foreground">
                                → {example.translation}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}