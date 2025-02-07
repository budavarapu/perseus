// @flow
/**
 * Some Perseus widgets use _.uniqueId(prefix) to generate unique
 * identifiers.  This function returns a mock version that can be
 * used in tests to properly isolate them from each other.
 */
export const getMockUniqueId: () => (string) => string = () => {
    const prefixCounts = {};
    const mockUniqueId = (prefix: string): string => {
        if (typeof prefixCounts[prefix] === "undefined") {
            prefixCounts[prefix] = 0;
        }
        const count = prefixCounts[prefix];
        prefixCounts[prefix]++;
        return `${prefix}${count}`;
    };
    return mockUniqueId;
};
