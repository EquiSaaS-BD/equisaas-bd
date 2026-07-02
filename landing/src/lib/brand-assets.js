export const BRAND_ASSET_VERSION = "20260406a";

export function withBrandAssetVersion(assetPath) {
  return `${assetPath}?v=${BRAND_ASSET_VERSION}`;
}
