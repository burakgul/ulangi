/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import { assertExists } from '@ulangi/assert';
import { Theme } from '@ulangi/ulangi-common/enums';
import {
  ObservableSetStore,
  ObservableThemeStore,
  ObservableVocabularyDetailScreen,
} from '@ulangi/ulangi-observable';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { VocabularyDetailScreenIds } from '../../constants/ids/VocabularyDetailScreenIds';
import { VocabularyDetailScreenDelegate } from '../../delegates/vocabulary/VocabularyDetailScreenDelegate';
import { VocabularyDetailDefinitions } from '../../views/vocabulary/VocabularyDetailDefinitions';
import { VocabularyDetailExtraFields } from '../../views/vocabulary/VocabularyDetailExtraFields';
import { VocabularyDetailPronunciation } from '../../views/vocabulary/VocabularyDetailPronunciation';
import { VocabularyDetailSpacedRepetitionInfo } from '../../views/vocabulary/VocabularyDetailSpacedRepetitionInfo';
import { VocabularyDetailTitle } from '../../views/vocabulary/VocabularyDetailTitle';
import { VocabularyDetailWritingInfo } from '../../views/vocabulary/VocabularyDetailWritingInfo';
import {
  VocabularyDetailScreenStyles,
  darkStyles,
  lightStyles,
} from './VocabularyDetailScreen.style';

export interface VocabularyDetailScreenProps {
  setStore: ObservableSetStore;
  themeStore: ObservableThemeStore;
  observableScreen: ObservableVocabularyDetailScreen;
  screenDelegate: VocabularyDetailScreenDelegate;
}

export class VocabularyDetailScreen extends React.Component<
  VocabularyDetailScreenProps
> {
  public get styles(): VocabularyDetailScreenStyles {
    return this.props.themeStore.theme === Theme.LIGHT
      ? lightStyles
      : darkStyles;
  }

  public render(): React.ReactElement<any> {
    const currentSet = assertExists(
      this.props.setStore.currentSet,
      'currentSet should not be undefined or null',
    );
    return (
      <View
        style={this.styles.screen}
        testID={VocabularyDetailScreenIds.SCREEN}>
        <ScrollView style={this.styles.container}>
          <VocabularyDetailTitle
            theme={this.props.themeStore.theme}
            vocabularyTerm={
              this.props.observableScreen.vocabulary.vocabularyTerm
            }
          />
          <VocabularyDetailPronunciation
            theme={this.props.themeStore.theme}
            observableScreen={this.props.observableScreen}
            speak={(): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                this.props.observableScreen.vocabulary.vocabularyTerm,
                currentSet.learningLanguageCode,
              )
            }
          />
          <VocabularyDetailExtraFields
            theme={this.props.themeStore.theme}
            vocabularyExtraFields={
              this.props.observableScreen.vocabulary.vocabularyExtraFields
            }
            speakState={this.props.observableScreen.speakState}
            speak={(text): void =>
              this.props.screenDelegate.synthesizeAndSpeak(
                text,
                currentSet.learningLanguageCode,
              )
            }
          />
          <VocabularyDetailDefinitions
            theme={this.props.themeStore.theme}
            definitions={this.props.observableScreen.vocabulary.definitions}
          />
          <VocabularyDetailSpacedRepetitionInfo
            theme={this.props.themeStore.theme}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextSpacedRepetitionReview(
              this.props.observableScreen.vocabulary,
            )}
          />
          <VocabularyDetailWritingInfo
            theme={this.props.themeStore.theme}
            vocabulary={this.props.observableScreen.vocabulary}
            nextReview={this.props.screenDelegate.calculateNextWritingReview(
              this.props.observableScreen.vocabulary,
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
