# Feature Specification: writings-category-guide

**Feature Branch**: `[001-writings-category-guide]`

**Created**: 2026-06-09

**Status**: Draft

**Input**: User description: "帮我在思考于文章增加一个分类的官方说明，现在感觉有点乱。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Author clarifies category boundaries (Priority: P1)

As the site author, I want a clear official explanation of each writings category so that I can consistently decide which category a new article belongs to.

**Why this priority**: Without clear category definitions, articles get placed inconsistently, making the site feel disorganized ("有点乱").

**Independent Test**: Can be tested by reading the official explanation document and verifying it provides clear guidance for categorizing articles.

**Acceptance Scenarios**:

1. **Given** I have written a new article about my experience using AI coding tools, **When** I read the official category explanation, **Then** I can clearly identify that "AI 辅助开发" is the correct category based on the description
2. **Given** I have written a philosophical article about fundamental principles of product design, **When** I read the official category explanation, **Then** I can determine whether it belongs in "第一性原理" or another category based on clear boundary descriptions
3. **Given** I am unsure whether my article about a specific CMS implementation belongs in "开源 CMS 实战" or "全栈技术教程", **When** I read the official category explanation, **Then** I understand the distinguishing criteria between these categories

---

### User Story 2 - Reader understands content organization (Priority: P2)

As a reader, I want to understand what types of content each category contains so I can efficiently find articles matching my interests.

**Why this priority**: Clear category explanations improve reader experience and content discoverability.

**Independent Test**: Can be tested by having a reader navigate the site and successfully find relevant content based on category descriptions.

**Acceptance Scenarios**:

1. **Given** I am interested in learning about AI programming tools, **When** I visit the "AI 辅助开发" category, **Then** I understand from its description that this section contains my desired content
2. **Given** I want to learn about long-term insights from business and life, **When** I read the category explanations, **Then** I can find "启示录" as the appropriate section

---

### User Story 3 - Future categories follow consistent pattern (Priority: P3)

As the site author, I want category explanations to follow a consistent pattern so that adding new categories in the future follows established conventions.

**Why this priority**: Consistency in documentation ensures the system remains maintainable as the site evolves.

**Independent Test**: Can be tested by verifying that any future category additions follow the same documentation structure.

**Acceptance Scenarios**:

1. **Given** I need to add a new category in the future, **When** I follow the established pattern from existing category explanations, **Then** the new category follows the same format and quality standards

---

### Edge Cases

- What happens when an article could reasonably fit into two categories? (Resolution: Define primary vs secondary categorization)
- How do we handle articles that don't clearly fit any existing category? (Resolution: Document the decision-making process)
- What if category descriptions become outdated as content strategy evolves? (Resolution: Include a "last reviewed" date)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a persistent official explanation document for writings categories that is accessible to both author and readers
- **FR-002**: Each category MUST have a clear description that distinguishes it from other categories, including what types of content belong there and what types do not
- **FR-003**: Each category description MUST include: name (Chinese), folder name (English), purpose, typical content examples, and boundary guidance (what belongs vs what doesn't)
- **FR-004**: Category explanations MUST be placed in a consistent, discoverable location (either as a dedicated documentation file or clearly linked section)
- **FR-005**: The official explanation MUST be updated whenever categories are added, modified, or removed
- **FR-006**: Category descriptions MUST NOT include implementation details (tech stack, file structure, code examples)

### Key Entities

- **Category**: A classification within writings that groups related articles. Attributes: English folder name, Chinese display name, description, order, purpose statement, content examples, boundary criteria.
- **Category Explanation Document**: A persistent reference document that contains all category definitions. Can be a dedicated markdown file or section within existing documentation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Author can categorize a new article within 5 minutes by reading the official explanation (no ambiguity)
- **SC-002**: All existing 6 categories have complete descriptions covering: name, purpose, examples, and boundaries
- **SC-003**: Reader can understand the difference between any two categories within 30 seconds of reading the explanation
- **SC-004**: The official explanation document is linked or accessible from the writings category index page

## Assumptions

- The official explanation will be placed as a dedicated documentation file (e.g., `content/writings/_category-guide.md` or similar) rather than embedded in the README
- The 6 existing categories are sufficient and no merging/splitting is needed
- Categories follow alphabetical English folder naming that maps to Chinese display names via `_meta.json`
- The site is primarily used by a single author (no team collaboration complexity for categorization decisions)
