import {CustomLink} from '../utils/custom-link-utils/custom-link';

export interface Config {
  default_node_count?: number;
  show_demo_info?: boolean;
  show_terms_of_service?: boolean;
  share_kubeconfig?: boolean;
  openstack?: {wizard_use_default_user?: boolean;};
  google_analytics_code?: string;
  google_analytics_config?: object;
  cleanup_cluster?: boolean;
  custom_links?: CustomLink[];
  oidc_provider_url?: string;
  oidc_provider_scope?: string;
  hide_kubernetes?: boolean;
  hide_openshift?: boolean;
}

export interface UserGroupConfig {
  owners?: GroupConfig;
  editors?: GroupConfig;
  viewers?: GroupConfig;
}

export class GroupConfig {
  projects?: Projects;
  members?: Members;
  sshKeys?: SSHKeys;
  clusters?: Clusters;
  nodes?: Nodes;
  nodeDeployments?: NodeDeployments;
  serviceaccounts?: ServiceAccounts;
  serviceaccountToken?: ServiceAccountToken;
}

export class Projects {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class Members {
  view?: boolean;
  edit?: boolean;
  remove?: boolean;
  invite?: boolean;
}

export class SSHKeys {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class Clusters {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class Nodes {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class NodeDeployments {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class ServiceAccounts {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}

export class ServiceAccountToken {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
}
