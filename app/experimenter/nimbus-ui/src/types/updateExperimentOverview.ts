/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateExperimentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateExperimentOverview
// ====================================================

export interface updateExperimentOverview_updateExperimentOverview_nimbusExperiment {
  __typename: "NimbusExperimentType";
  name: string;
  hypothesis: string | null;
  publicDescription: string | null;
}

export interface updateExperimentOverview_updateExperimentOverview {
  __typename: "UpdateExperimentOverview";
  clientMutationId: string | null;
  message: ObjectField | null;
  status: number | null;
  nimbusExperiment: updateExperimentOverview_updateExperimentOverview_nimbusExperiment | null;
}

export interface updateExperimentOverview {
  updateExperimentOverview: updateExperimentOverview_updateExperimentOverview | null;
}

export interface updateExperimentOverviewVariables {
  input: UpdateExperimentInput;
}
