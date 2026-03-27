export const planLimits = {
  individual: {
    maxGroups: 5,
    maxMembersPerGroup: 10,
    canUploadReceipts: false,
    canUseCategories: true,
    canCreateBusinessGroups: false,
    canUseMultiCurrency: false,
    canExportData: false,
    canUseAPI: false,
    price: 3
  },
  freelancer: {
    maxGroups: 15,
    maxMembersPerGroup: 25,
    canUploadReceipts: true,
    canUseCategories: true,
    canCreateBusinessGroups: false,
    canUseMultiCurrency: true,
    canExportData: true,
    canUseAPI: false,
    price: 10
  },
  business: {
    maxGroups: 100,
    maxMembersPerGroup: 100,
    canUploadReceipts: true,
    canUseCategories: true,
    canCreateBusinessGroups: true,
    canUseMultiCurrency: true,
    canExportData: true,
    canUseAPI: true,
    price: 35
  }
};