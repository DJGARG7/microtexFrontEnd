import styled from "styled-components";

export const Styles = styled.div`
  .table--sticky {
    border: 1px solid #ddd;
    
    .tr--sticky {
      :last-child {
        .td--sticky {
          border-bottom: 0;
        }
      }
    }
    .th--sticky,
    .td--sticky {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      background-color: #fff;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }
    }

    .th--sticky {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: center;
      background-color: #04aa6d;

      color: white;
    }

    &.sticky {
      overflow: scroll;
      .header,
      .footer {
        position: sticky;
        z-index: 1;
        width: fit-content;
      }

      .header--sticky {
        top: 0;
        box-shadow: 0px 3px 3px #ccc;
      }

      .footer {
        bottom: 0;
        box-shadow: 0px -3px 3px #ccc;
      }

      .body--sticky {
        position: relative;
        z-index: 0;
      }

      [data-sticky-td--sticky] {
        position: sticky;
      }

      [data-sticky-last-left-td--sticky] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td--sticky] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`;
